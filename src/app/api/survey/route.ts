import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured, DbSurveyResponse } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ 
      error: 'Supabase nie jest skonfigurowany. Ustaw NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      responses: [] 
    }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const municipality = searchParams.get('municipality');

  if (!municipality) {
    return NextResponse.json({ 
      error: 'Brak parametru municipality',
      responses: [] 
    }, { status: 400 });
  }

  try {
    const supabase = getSupabase()!;
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .eq('municipality', municipality.toLowerCase())
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

    if (!body.municipality) {
      return NextResponse.json({ 
        error: 'Brak parametru municipality' 
      }, { status: 400 });
    }
    
    const newResponse: DbSurveyResponse = {
      municipality: body.municipality.toLowerCase(),
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
