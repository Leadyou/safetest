import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured, DbSurveyResponse } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ 
      error: 'Supabase nie jest skonfigurowany. Ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      responses: [] 
    }, { status: 503 });
  }

  try {
    const supabase = getSupabase()!;
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ responses: data || [] });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to fetch responses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ 
      error: 'Supabase nie jest skonfigurowany. Ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY.' 
    }, { status: 503 });
  }

  try {
    const supabase = getSupabase()!;
    const body = await request.json();
    
    const newResponse: DbSurveyResponse = {
      communication: body.communication,
      resources: body.resources,
      knowledge: body.knowledge,
      social_capital: body.socialCapital,
      competencies: body.competencies,
    };

    const { data, error } = await supabase
      .from('survey_responses')
      .insert([newResponse])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ response: data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}
