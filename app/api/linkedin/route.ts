/**
 * POST /api/linkedin
 * 
 * Generate and optionally publish LinkedIn posts to the
 * WRFCO "Home Ownership News" business page.
 * 
 * Actions:
 *   - generate: AI-generates a post from a topic
 *   - publish: Sends a post to LinkedIn via their API
 *   - schedule: Saves a post for future publishing
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateLinkedInPost } from '@/lib/claude';

// LinkedIn API helper
async function publishToLinkedIn(content: string): Promise<{ success: boolean; postId?: string; error?: string }> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const pageId = process.env.LINKEDIN_PAGE_ID;

  if (!accessToken || !pageId) {
    return { success: false, error: 'LinkedIn API not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PAGE_ID.' };
  }

  try {
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({
        author: `urn:li:organization:${pageId}`,
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: { text: content },
            shareMediaCategory: 'NONE',
          },
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return { success: false, error: `LinkedIn API error: ${err}` };
    }

    const data = await response.json();
    return { success: true, postId: data.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, topic, content, data } = await request.json();

    switch (action) {
      case 'generate': {
        if (!topic) {
          return NextResponse.json({ error: 'Missing "topic" for generation' }, { status: 400 });
        }
        const result = await generateLinkedInPost(topic, data);
        return NextResponse.json({ success: true, ...result });
      }

      case 'publish': {
        if (!content) {
          return NextResponse.json({ error: 'Missing "content" to publish' }, { status: 400 });
        }
        const result = await publishToLinkedIn(content);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use "generate" or "publish".' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('LinkedIn API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
