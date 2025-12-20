import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateServerEnv } from '@/lib/env';
import { rateLimiters } from '@/lib/rate-limit';
import { insightsSchema } from '@/lib/validations/api';
import { formatErrorResponse, AuthenticationError, ValidationError, NotFoundError, ExternalServiceError } from '@/lib/errors';
import { withTimeout, getNetlifyTimeout } from '@/lib/api-timeout';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  try {
    // Validate server environment variables (including OPENAI_API_KEY)
    const serverEnv = validateServerEnv();
    
    // Initialize OpenAI client with validated API key
    const openai = new OpenAI({
      apiKey: serverEnv.OPENAI_API_KEY,
    });

    // Rate limiting
    const rateLimitResponse = rateLimiters.ai(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch {
      throw new ValidationError('Invalid request body');
    }

    const validationResult = insightsSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError(
        validationResult.error.issues[0]?.message || 'Invalid request data'
      );
    }

    const { formId } = validationResult.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError('Please log in to view insights');
    }

    // Fetch form and questions
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('title, description')
      .eq('id', formId)
      .single();

    if (formError || !form) {
      throw new NotFoundError('Form not found');
    }

    const { data: questions } = await supabase
      .from('form_questions')
      .select('id, title, type')
      .eq('form_id', formId)
      .order('order_index');

    // Fetch responses with answers
    const { data: responses } = await supabase
      .from('responses')
      .select('id, response_answers(question_id, answer)')
      .eq('form_id', formId)
      .not('submitted_at', 'is', null);

    if (!responses || responses.length < 3) {
      throw new ValidationError(
        `Not enough responses for analysis. Minimum 3 required, got ${responses?.length || 0}`
      );
    }

    // Format data for AI analysis
    const formattedResponses = responses.map(r => {
      const answers: Record<string, unknown> = {};
      r.response_answers?.forEach(a => {
        const question = questions?.find(q => q.id === a.question_id);
        if (question) {
          answers[question.title] = a.answer;
        }
      });
      return answers;
    });

    const prompt = `Analyze these survey responses and provide actionable insights.

Survey: "${form?.title}"
${form?.description ? `Description: ${form.description}` : ''}

Questions:
${questions?.map((q, i) => `${i + 1}. ${q.title} (${q.type})`).join('\n')}

Total Responses: ${responses.length}

Response Data:
${JSON.stringify(formattedResponses, null, 2)}

Provide a comprehensive analysis in JSON format with:
1. "summary": A 2-3 sentence executive summary of the key findings
2. "themes": Array of 3-5 main themes/patterns identified, each with "title", "description", and "percentage" (estimated % of responses showing this theme)
3. "sentiment": Overall sentiment analysis with "positive", "neutral", "negative" percentages and "overview" description
4. "keyQuotes": Array of 3-5 notable direct quotes from text responses (if any) with the response text
5. "recommendations": Array of 3-5 actionable recommendations based on the data
6. "outliers": Any unusual or unexpected patterns worth noting

Respond ONLY with valid JSON.`;

    // Generate insights with timeout
    const completion = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert data analyst specializing in survey analysis. Provide clear, actionable insights from survey data. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
      getNetlifyTimeout()
    );

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new ExternalServiceError('Failed to generate insights from AI', 'openai');
    }

    let insights;
    try {
      insights = JSON.parse(responseContent);
    } catch {
      throw new ExternalServiceError('Failed to parse AI response', 'openai');
    }

    // Store insights in form's analytics_snapshot for caching
    const { error: updateError } = await supabase
      .from('forms')
      .update({
        analytics_snapshot: {
          insights,
          generatedAt: new Date().toISOString(),
          responseCount: responses.length,
        },
      })
      .eq('id', formId);

    if (updateError) {
      logger.warn('Failed to update analytics snapshot', { error: updateError, formId });
      // Don't fail the request if snapshot update fails
    }

    logger.info('Insights generated successfully', { formId, userId: user.id, responseCount: responses.length });

    return NextResponse.json({ 
      insights,
      responseCount: responses.length,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    logger.error('Error generating insights', { error });
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, code: errorResponse.code },
      { status: errorResponse.statusCode }
    );
  }
}

