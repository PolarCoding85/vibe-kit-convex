// components/pages/marketing/docs/docs-section.tsx

'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileCode,
  Terminal,
  PackageOpen,
  Database,
  ShieldCheck,
  CreditCard,
  Zap,
  Copy,
  Mail
} from 'lucide-react'

export const Documentation = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className='relative mt-4 mb-6'>
      <pre className='bg-secondary overflow-x-auto rounded-lg p-4 text-sm'>
        <code>{code}</code>
      </pre>
      <Button
        variant='outline'
        size='sm'
        className='absolute top-2 right-2'
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? (
          <span className='text-vibe flex items-center gap-1'>Copied!</span>
        ) : (
          <Copy className='h-4 w-4' />
        )}
      </Button>
    </div>
  )

  return (
    <section className='container mx-auto px-4 pt-24 pb-16'>
      <div className='mx-auto max-w-5xl'>
        <h1 className='mb-6 text-4xl font-bold'>VibeKit Documentation</h1>
        <p className='mb-10 text-xl text-gray-400'>
          Everything you need to know to start building your next SaaS project.
        </p>

        <Tabs defaultValue='getting-started' className='mb-12'>
          <TabsList className='mb-8'>
            <TabsTrigger value='getting-started'>Getting Started</TabsTrigger>
            <TabsTrigger value='components'>Components</TabsTrigger>
            <TabsTrigger value='authentication'>Authentication</TabsTrigger>
            <TabsTrigger value='database'>Database</TabsTrigger>
            <TabsTrigger value='payments'>Payments</TabsTrigger>
            <TabsTrigger value='emails'>Emails</TabsTrigger>
          </TabsList>

          <TabsContent value='getting-started'>
            <div className='space-y-8'>
              <Card className='bg-background'>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <FileCode className='text-vibe mr-2' /> Project Setup
                  </h2>
                  <p className='mb-4'>
                    Get started with your new VibeKit project in minutes.
                  </p>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Clone the repository:
                  </h3>
                  <CodeBlock
                    id='clone-repo'
                    code='git clone https://github.com/your-username/vibekit.git'
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Install dependencies:
                  </h3>
                  <CodeBlock id='install-deps' code='npm install' />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Run the development server:
                  </h3>
                  <CodeBlock id='run-dev' code='npm run dev' />
                </CardContent>
              </Card>

              <Card className='bg-background'>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <Terminal className='text-vibe mr-2' /> Project Structure
                  </h2>
                  <p className='mb-4'>
                    Understanding the organization of your VibeKit project.
                  </p>

                  <CodeBlock
                    id='project-structure'
                    code={`vibekit/
├── src/
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks 
│   ├── lib/               # Utility functions and helpers
│   ├── pages/             # Page components
│   └── styles/            # Global styles and themes
├── public/                # Static assets
└── package.json           # Project dependencies and scripts`}
                  />
                </CardContent>
              </Card>

              <Card className='bg-background'>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <PackageOpen className='text-vibe mr-2' /> Core Technologies
                  </h2>
                  <p className='mb-4'>
                    VibeKit is built with these powerful technologies:
                  </p>

                  <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Next.js & TypeScript</h3>
                      <p className='text-sm text-gray-400'>
                        The React framework for production with strong typing
                        support.
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Tailwind CSS</h3>
                      <p className='text-sm text-gray-400'>
                        Utility-first CSS framework for rapid UI development.
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Shadcn UI</h3>
                      <p className='text-sm text-gray-400'>
                        Beautiful, accessible UI components built with Radix UI
                        and Tailwind.
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Clerk</h3>
                      <p className='text-sm text-gray-400'>
                        Complete user management with authentication and
                        authorization.
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Convex</h3>
                      <p className='text-sm text-gray-400'>
                        Backend development platform with real-time
                        capabilities.
                      </p>
                    </div>
                    <div className='rounded-lg border border-gray-800 p-4'>
                      <h3 className='mb-2 font-medium'>Stripe</h3>
                      <p className='text-sm text-gray-400'>
                        Payment processing for subscription management.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='components'>
            <div className='space-y-6'>
              <h2 className='mb-6 text-2xl font-semibold'>UI Components</h2>
              <p className='mb-6'>
                VibeKit comes with a variety of pre-built components to help you
                build your application quickly.
              </p>

              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem value='buttons'>
                  <AccordionTrigger>Buttons</AccordionTrigger>
                  <AccordionContent>
                    <p className='mb-4'>
                      VibeKit provides several button variants to use in your
                      application.
                    </p>
                    <div className='mb-4 flex flex-wrap gap-4'>
                      <Button>Default</Button>
                      <Button variant='secondary'>Secondary</Button>
                      <Button variant='outline'>Outline</Button>
                      <Button variant='ghost'>Ghost</Button>
                      <Button variant='destructive'>Destructive</Button>
                    </div>
                    <CodeBlock
                      id='button-code'
                      code={`import { Button } from "@/components/ui/button";

const MyComponent = () => {
  return (
    <div className="space-x-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
};`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='cards'>
                  <AccordionTrigger>Cards</AccordionTrigger>
                  <AccordionContent>
                    <p className='mb-4'>
                      Cards are used to group related content.
                    </p>
                    <Card className='mx-auto mb-4 w-full max-w-md'>
                      <CardContent className='pt-6'>
                        <h3 className='mb-2 text-lg font-medium'>Card Title</h3>
                        <p className='text-gray-400'>
                          This is an example of a card component from Shadcn UI.
                        </p>
                      </CardContent>
                    </Card>
                    <CodeBlock
                      id='card-code'
                      code={`import { Card, CardContent } from "@/components/ui/card";

const MyComponent = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-2">Card Title</h3>
        <p>Card content goes here.</p>
      </CardContent>
    </Card>
  );
};`}
                    />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value='tabs'>
                  <AccordionTrigger>Tabs</AccordionTrigger>
                  <AccordionContent>
                    <p className='mb-4'>
                      Tabs allow users to navigate between related sections of
                      content.
                    </p>
                    <Tabs
                      defaultValue='tab1'
                      className='mx-auto mb-4 w-full max-w-md'
                    >
                      <TabsList className='grid w-full grid-cols-2'>
                        <TabsTrigger value='tab1'>Tab 1</TabsTrigger>
                        <TabsTrigger value='tab2'>Tab 2</TabsTrigger>
                      </TabsList>
                      <TabsContent value='tab1'>
                        <Card>
                          <CardContent className='pt-6'>
                            <p>Content for Tab 1</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value='tab2'>
                        <Card>
                          <CardContent className='pt-6'>
                            <p>Content for Tab 2</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                    <CodeBlock
                      id='tabs-code'
                      code={`import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const MyComponent = () => {
  return (
    <Tabs defaultValue="tab1">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <Card>
          <CardContent className="pt-6">
            <p>Content for Tab 1</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="tab2">
        <Card>
          <CardContent className="pt-6">
            <p>Content for Tab 2</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};`}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value='authentication'>
            <div className='space-y-6'>
              <Card>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <ShieldCheck className='text-vibe mr-2' /> Authentication
                    with Clerk
                  </h2>
                  <p className='mb-4'>
                    VibeKit uses Clerk for authentication and user management.
                  </p>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>Setup</h3>
                  <p className='mb-4'>To set up Clerk authentication:</p>
                  <ol className='mb-6 list-inside list-decimal space-y-2'>
                    <li>Create a Clerk account and set up your application</li>
                    <li>
                      Add your Clerk API keys to your environment variables
                    </li>
                    <li>Use the provided authentication components</li>
                  </ol>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Environment Variables
                  </h3>
                  <CodeBlock
                    id='env-vars'
                    code={`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_***
CLERK_SECRET_KEY=sk_test_***`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Usage Example
                  </h3>
                  <CodeBlock
                    id='auth-code'
                    code={`import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <SignIn />
    </div>
  );
};

export default SignInPage;`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Protecting Routes
                  </h3>
                  <CodeBlock
                    id='protected-route'
                    code={`import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ProtectedPage = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);
  
  if (!isLoaded || !userId) {
    return <div>Loading...</div>;
  }
  
  return <div>Protected content</div>;
};

export default ProtectedPage;`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='database'>
            <div className='space-y-6'>
              <Card>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <Database className='text-vibe mr-2' /> Database with Convex
                  </h2>
                  <p className='mb-4'>
                    VibeKit uses Convex for the database and backend
                    functionality.
                  </p>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>Setup</h3>
                  <ol className='mb-6 list-inside list-decimal space-y-2'>
                    <li>Create a Convex account and set up your project</li>
                    <li>
                      Add your Convex deployment URL to your environment
                      variables
                    </li>
                    <li>Use the provided data access hooks</li>
                  </ol>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Environment Variables
                  </h3>
                  <CodeBlock
                    id='convex-env'
                    code={`NEXT_PUBLIC_CONVEX_URL=https://example-123.convex.cloud`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Defining a Schema
                  </h3>
                  <CodeBlock
                    id='schema-code'
                    code={`// convex/schema.ts
import { defineSchema, defineTable } from "convex/schema";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
  }),
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    published: v.boolean(),
    authorId: v.string(),
  }),
});`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Query Example
                  </h3>
                  <CodeBlock
                    id='query-code'
                    code={`// convex/posts.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts")
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .take(10);
  },
});

// In your React component:
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const PostsList = () => {
  const posts = useQuery(api.posts.list);
  
  if (!posts) return <div>Loading...</div>;
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  );
};`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='payments'>
            <div className='space-y-6'>
              <Card>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <CreditCard className='text-vibe mr-2' /> Payments with
                    Stripe
                  </h2>
                  <p className='mb-4'>
                    VibeKit integrates with Stripe for payment processing and
                    subscription management.
                  </p>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>Setup</h3>
                  <ol className='mb-6 list-inside list-decimal space-y-2'>
                    <li>
                      Create a Stripe account and set up your products and
                      prices
                    </li>
                    <li>
                      Add your Stripe API keys to your environment variables
                    </li>
                    <li>
                      Use the provided components for checkout and billing
                    </li>
                  </ol>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Environment Variables
                  </h3>
                  <CodeBlock
                    id='stripe-env'
                    code={`STRIPE_SECRET_KEY=sk_test_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_***
STRIPE_WEBHOOK_SECRET=whsec_***`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Creating a Checkout Session
                  </h3>
                  <CodeBlock
                    id='checkout-code'
                    code={`// pages/api/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { priceId, userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: \`\${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${req.headers.origin}/pricing\`,
      client_reference_id: userId,
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Checkout Button Component
                  </h3>
                  <CodeBlock
                    id='checkout-btn'
                    code={`import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutButtonProps {
  priceId: string;
  userId: string;
}

const CheckoutButton = ({ priceId, userId }: CheckoutButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId,
        }),
      });

      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={loading}>
      {loading ? "Loading..." : "Subscribe Now"}
    </Button>
  );
};

export default CheckoutButton;`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='emails'>
            <div className='space-y-6'>
              <Card>
                <CardContent className='pt-6'>
                  <h2 className='mb-4 flex items-center text-2xl font-semibold'>
                    <Mail className='text-vibe mr-2' /> Emails with Resend
                  </h2>
                  <p className='mb-4'>
                    VibeKit integrates with Resend for sending transactional and
                    marketing emails.
                  </p>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>Setup</h3>
                  <ol className='mb-6 list-inside list-decimal space-y-2'>
                    <li>
                      Create a Resend account at{' '}
                      <a
                        href='https://resend.com'
                        className='text-vibe hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        resend.com
                      </a>
                    </li>
                    <li>Get your API key from the Resend dashboard</li>
                    <li>
                      Add your Resend API key to your environment variables
                    </li>
                    <li>Install the Resend SDK</li>
                  </ol>

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Environment Variables
                  </h3>
                  <CodeBlock
                    id='resend-env'
                    code={`RESEND_API_KEY=re_123456789`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Installation
                  </h3>
                  <CodeBlock id='resend-install' code={`npm install resend`} />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>Basic Usage</h3>
                  <CodeBlock
                    id='resend-basic'
                    code={`import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Send a simple email
const sendEmail = async () => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'user@example.com',
      subject: 'Welcome to VibeKit',
      html: '<p>Thanks for signing up!</p>',
    });

    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Using React Email Templates
                  </h3>
                  <p className='mb-4'>
                    Resend works great with React Email for creating beautiful
                    email templates:
                  </p>

                  <CodeBlock
                    id='resend-react-email'
                    code={`// First, install React Email
npm install @react-email/components

// Create a welcome email template (WelcomeEmail.tsx)
import { 
  Body, 
  Container, 
  Head, 
  Heading, 
  Html, 
  Link, 
  Preview, 
  Text 
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  username: string;
}

export const WelcomeEmail = ({ username }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to VibeKit!</Preview>
    <Body style={{
      backgroundColor: '#f6f9fc',
      fontFamily: 'Arial, sans-serif',
    }}>
      <Container style={{
        backgroundColor: '#ffffff',
        margin: '0 auto',
        padding: '20px',
        borderRadius: '5px',
      }}>
        <Heading>Welcome, {username}!</Heading>
        <Text>Thanks for signing up for VibeKit. We're excited to have you on board.</Text>
        <Text>
          Get started by exploring our{' '}
          <Link href="https://example.com/dashboard">dashboard</Link>.
        </Text>
      </Container>
    </Body>
  </Html>
);

// Use the template with Resend
import { Resend } from 'resend';
import { WelcomeEmail } from './emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendWelcomeEmail = async (email: string, username: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'welcome@yourdomain.com',
      to: email,
      subject: 'Welcome to VibeKit',
      react: WelcomeEmail({ username }),
    });

    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Email Verification
                  </h3>
                  <CodeBlock
                    id='resend-verification'
                    code={`import { Resend } from 'resend';
import { nanoid } from 'nanoid';

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate and send a verification token
const sendVerificationEmail = async (email: string) => {
  // Generate a verification token
  const token = nanoid(32);
  
  // Store the token in your database with the user's email and an expiration time
  
  // Create verification URL
  const verificationUrl = \`https://yourdomain.com/verify?token=\${token}\`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'verification@yourdomain.com',
      to: email,
      subject: 'Verify your email address',
      html: \`
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="\${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      \`,
    });

    if (error) {
      return { error };
    }
    
    return { data };
  } catch (error) {
    return { error };
  }
};`}
                  />

                  <h3 className='mt-6 mb-2 text-lg font-medium'>
                    Handling Webhooks
                  </h3>
                  <p className='mb-4'>
                    Resend provides webhooks to track email delivery status:
                  </p>

                  <CodeBlock
                    id='resend-webhooks'
                    code={`// Create a webhook handler endpoint in your API
app.post('/api/webhooks/resend', async (req, res) => {
  const payload = req.body;
  
  // Verify the webhook signature to ensure it's from Resend
  // Process different event types
  switch (payload.type) {
    case 'email.delivered':
      console.log(\`Email \${payload.data.email_id} was delivered\`);
      // Update your database
      break;
    case 'email.opened':
      console.log(\`Email \${payload.data.email_id} was opened\`);
      // Track open rates
      break;
    case 'email.clicked':
      console.log(\`Link in email \${payload.data.email_id} was clicked\`);
      // Track click rates
      break;
    case 'email.complained':
      console.log(\`Email \${payload.data.email_id} received a complaint\`);
      // Handle complaints
      break;
    default:
      console.log(\`Unhandled event type: \${payload.type}\`);
  }
  
  res.status(200).json({ message: 'Webhook received' });
});`}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className='bg-secondary/50 border-primary/30 mt-12 rounded-lg border p-6'>
          <div className='mb-4 flex items-center'>
            <Zap className='text-primary mr-2 h-6 w-6' />
            <h2 className='text-xl font-semibold'>Need More Help?</h2>
          </div>
          <p className='mb-4'>
            Join our community for additional resources, discussions, and
            support.
          </p>
          <div className='flex flex-wrap gap-4'>
            <Button className='bg-primary hover:bg-primary/90'>
              Join Discord
            </Button>
            <Button variant='outline'>GitHub Repository</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
