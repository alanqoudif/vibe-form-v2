import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { formId } = await request.json();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch form and questions
    const { data: form } = await supabase
      .from('forms')
      .select('title, description')
      .eq('id', formId)
      .single();

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
      return NextResponse.json({ 
        error: 'Not enough responses for analysis',
        minRequired: 3,
        current: responses?.length || 0
      }, { status: 400 });
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

    const completion = await openai.chat.completions.create({
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
    });

    const insights = JSON.parse(completion.choices[0].message.content || '{}');

    // Store insights in form's analytics_snapshot for caching
    await supabase
      .from('forms')
      .update({
        analytics_snapshot: {
          insights,
          generatedAt: new Date().toISOString(),
          responseCount: responses.length,
        },
      })
      .eq('id', formId);

    return NextResponse.json({ 
      insights,
      responseCount: responses.length,
      generatedAt: new Date().toISOString(),
    });

  } catch (error: unknown) {
    console.error('Error generating insights:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to generate insights'
    }, { status: 500 });
  }
}

