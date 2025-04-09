// components/pages/marketing/landing/faq-section.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import Link from 'next/link'

const faqs = [
  {
    question: 'What is VibeKits?',
    answer:
      'VibeKits is a complete starter kit for building SaaS applications using Next.js, TypeScript, Tailwind CSS, Shadcn UI, Clerk, Stripe, Convex, Zod, and more. It provides all the boilerplate and infrastructure you need to start building your SaaS product immediately.'
  },
  {
    question:
      'Is this a one-time purchase or subscription?',
    answer:
      'VibeKits is available as a one-time purchase. Once you buy it, you can use it for your own projects without any recurring fees. Updates and improvements to the kit will be available based on your plan.'
  },
  {
    question:
      'Can I use VibeKits for client projects?',
    answer:
      "Yes, but the license you need depends on how you'll use it. The Starter plan allows usage for a single project, while the Pro plan allows unlimited personal projects. For client work, the Agency plan is recommended as it includes a client-ready license."
  },
  {
    question:
      'What tech stack does VibeKits use?',
    answer:
      "VibeKits uses Next.js, TypeScript, Tailwind CSS, Shadcn UI, Clerk for authentication, Stripe for payments, Convex for the database, and Zod for form validation. It's designed to be modern, type-safe, and optimized for developer productivity."
  },
  {
    question:
      'Do I need technical knowledge to use VibeKits?',
    answer:
      "VibeKits is designed for developers who are familiar with React and modern web development. While it simplifies many aspects of building a SaaS, you'll need basic knowledge of JavaScript/TypeScript and React to make the most of it."
  },
  {
    question:
      'What kind of support is included?',
    answer:
      'Support varies by plan. The Starter plan includes 6 months of support, Pro includes 1 year of priority support, and Agency includes premium support. Support is provided via email and GitHub issues.'
  },
  {
    question:
      'Can I request features or customizations?',
    answer:
      'Yes! We welcome feature requests from all customers. For custom development or specific integrations, we offer additional services which can be discussed after purchase.'
  },
  {
    question:
      'Is VibeKits optimized for Vibe Coding with AI?',
    answer:
      'Absolutely! VibeKits is specifically structured to work well with AI coding assistants. The codebase is clean, well-documented, and follows consistent patterns that make it ideal for AI-assisted development.'
  }
]

export const FAQSection = () => {
  return (
    <section id='faq' className='py-20'>
      <div className='container mx-auto px-4'>
        <div className='mx-auto mb-12 max-w-3xl text-center'>
          <h2 className='mb-4 text-3xl font-bold md:text-4xl'>
            Frequently Asked{' '}
            <span className='from-primary dark:from-primary dark:to-primary/60 bg-gradient-to-r to-green-300 bg-clip-text text-transparent'>
              Questions
            </span>
          </h2>
          <p className='text-lg text-gray-400'>
            Everything you need to know
            about VibeKits
          </p>
        </div>

        <div className='mx-auto max-w-3xl'>
          <Accordion
            type='single'
            collapsible
            className='w-full'
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='border-gray-800'
              >
                <AccordionTrigger className='text-left font-medium'>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className='text-gray-400'>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className='mt-12 text-center'>
          <p className='text-gray-400'>
            Have another question?{' '}
            <Link
              href='/contact'
              className='text-primary hover:underline'
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
