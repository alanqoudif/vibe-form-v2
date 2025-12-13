import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert survey and form designer. When given a description, create a professional form structure.

Return a JSON object with this exact structure:
{
  "title": "Form title (concise, professional)",
  "description": "Brief description of the form's purpose",
  "category": "One of: research, feedback, registration, assessment, survey, other",
  "estimated_time": 5, // estimated minutes to complete (integer)
  "difficulty": 5, // 1-10 scale (1=easy, 10=complex)
  "questions": [
    {
      "type": "short_text | long_text | mcq | checkbox | likert | rating | dropdown",
      "title": "Question text",
      "description": "Optional helper text",
      "required": true/false,
      "options": {} // type-specific options
    }
  ]
}

Question type specifications:
- short_text: Single line text input. options: { placeholder?: string, maxLength?: number }
- long_text: Multi-line text. options: { placeholder?: string, maxLength?: number, rows?: number }
- mcq: Single choice. options: { choices: string[] }
- checkbox: Multiple choice. options: { choices: string[], minSelect?: number, maxSelect?: number }
- likert: Scale rating. options: { scale: 5 | 7, labels: { low: string, high: string } }
- rating: Star rating. options: { maxStars: 5 | 10 }
- dropdown: Dropdown select. options: { choices: string[] }

Guidelines:
1. Create 5-15 questions depending on complexity
2. Start with easy questions, build up to more detailed ones
3. Use a variety of question types
4. Make questions clear and unambiguous
5. Include demographic questions if relevant
6. For research surveys, include proper scales (Likert)
7. Keep the form focused on the stated purpose`;

export async function POST(request: NextRequest) {
  try {
    // Get the user session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
      return NextResponse.json(
        { message: 'Please provide a more detailed description (at least 10 characters).' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Generate form using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Create a form for: ${prompt}` }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { message: 'Failed to generate form. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the AI response
    let formData;
    try {
      formData = JSON.parse(responseContent);
    } catch {
      return NextResponse.json(
        { message: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      );
    }

    // Validate the form data
    if (!formData.title || !formData.questions || !Array.isArray(formData.questions)) {
      return NextResponse.json(
        { message: 'Invalid form structure generated. Please try again.' },
        { status: 500 }
      );
    }

    // Calculate AI-determined reward
    // Base: 10 points
    // Time: 2 points per minute
    // Difficulty: 5 points per difficulty level
    const estimatedTime = formData.estimated_time || 5;
    const difficulty = formData.difficulty || 3;
    const calculatedReward = 10 + (estimatedTime * 2) + (difficulty * 5);

    // Create the form in the database
    const { data: form, error: formError } = await supabase
      .from('forms')
      .insert({
        owner_id: user.id,
        title: formData.title,
        description: formData.description || null,
        category: formData.category || null,
        status: 'draft',
        visibility: 'unlisted',
        ai_prompt: prompt,
        primary_language: 'en',
        settings: {
          reward: calculatedReward,
          estimated_time: estimatedTime,
          difficulty: difficulty
        },
      })
      .select()
      .single();

    if (formError || !form) {
      console.error('Error creating form:', formError);
      return NextResponse.json(
        { message: 'Failed to save form. Please try again.' },
        { status: 500 }
      );
    }

    // Create the questions
    const questions = formData.questions.map((q: {
      type: string;
      title: string;
      description?: string;
      required?: boolean;
      options?: Record<string, unknown>;
    }, index: number) => ({
      form_id: form.id,
      order_index: index,
      type: q.type || 'short_text',
      title: q.title,
      description: q.description || null,
      required: q.required ?? true,
      options: q.options || {},
      logic: null,
    }));

    const { error: questionsError } = await supabase
      .from('form_questions')
      .insert(questions);

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      // Clean up the form if questions failed
      await supabase.from('forms').delete().eq('id', form.id);
      return NextResponse.json(
        { message: 'Failed to save questions. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      formId: form.id,
      redirectUrl: `/forms/${form.id}/builder`,
      message: 'Form created successfully!',
    });

  } catch (error) {
    console.error('Error in generate-form API:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}







