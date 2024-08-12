import { workflow } from '@novu/framework';
import { renderEmail } from '../../emails/welcome-email';
import i18next from 'i18next';
import { z } from 'zod';

i18next.init({
  resources: {
    en: {
      translation: {
        welcomeEmailSubject: 'Welcome to Twitch, {{username}}!',
        welcomeEmailBody:
          'We’re glad you could join us. Twitch has a huge, passionate community ready to watch and celebrate all the things you’re into, and we’ve saved a seat just for you.',
        linkText: 'WATCH NOW',
        welcomeEmailBody2:
          'If you want to watch it, someone on Twitch streams it: games, anime, fitness, cosplay, esports, cooking, music, meditation. Take a look around, find a few channels to call home, and cozy up in chat.',
      },
    },
    de: {
      translation: {
        welcomeEmailSubject: 'Willkommen bei Twitch, {{username}}!',
        welcomeEmailBody:
          'Wir freuen uns, dass Sie sich uns anschließen konnten. Twitch hat eine riesige, leidenschaftliche Community, die bereit ist, alles zu sehen und zu feiern, was Sie interessiert, und wir haben einen Platz nur für Sie reserviert.',
        linkText: 'JETZT ANSEHEN',
        welcomeEmailBody2:
          'If you want to watch it, someone on Twitch streams it: games, anime, fitness, cosplay, esports, cooking, music, meditation. Take a look around, find a few channels to call home, and cozy up in chat.',
      },
    },
  },
});

export const welcomeWorkflow = workflow(
  'welcome-workflow',
  async ({ step, subscriber }) => {
    await step.email(
      'welcome-email',
      async (controls) => {
        const translate = i18next.getFixedT(
          subscriber?.locale || controls.fallbackLocale
        );

        const subject = translate('welcomeEmailSubject', {
          username: subscriber?.username || 'Novu',
        });
        const body = translate('welcomeEmailBody');
        const linkText = translate('linkText');
        const body2 = translate('welcomeEmailBody2');
        return {
          subject,
          body: renderEmail(subject, body, linkText, body2),
        };
      },
      {
        controlSchema: z.object({
          fallbackLocale: z.string().default('en').optional(),
        }),
      }
    );
  }
);
