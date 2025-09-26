import { AssistantUIWelcomeEmail } from '@/emails/assistant-ui';
import { Resend } from 'resend';
import * as React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, userName } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Assistant UI <onboarding@resend.dev>',
      to: [to],
      subject: subject || 'Welcome to Assistant UI',
      react: React.createElement(AssistantUIWelcomeEmail, { 
        userName: userName || 'there',
        steps: [
          {
            id: 1,
            Description: React.createElement('li', { className: "mb-20 text-gray-700", key: 1 },
              React.createElement('strong', null, 'Install assistant-ui.'),
              ' Get started in seconds with ',
              React.createElement('a', { 
                href: "https://assistant-ui.com/docs/getting-started", 
                className: "text-brand" 
              }, 'npm install assistant-ui'),
              ' and create your first chat interface.'
            ),
          },
          {
            id: 2,
            Description: React.createElement('li', { className: "mb-20 text-gray-700", key: 2 },
              React.createElement('strong', null, 'Explore our components.'),
              ' From simple chat bubbles to complex tool UIs, ',
              React.createElement('a', { 
                href: "https://assistant-ui.com/docs/components", 
                className: "text-brand" 
              }, 'browse our component library'),
              ' and see live examples.'
            ),
          },
        ],
        resources: [
          {
            title: 'Documentation',
            description: 'Complete guides and API reference',
            href: 'https://assistant-ui.com/docs',
            icon: '📖',
          },
          {
            title: 'Interactive Examples',
            description: 'Live demos with source code',
            href: 'https://assistant-ui.com/examples',
            icon: '🎨',
          },
        ],
      }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}