<script setup>
  import { ref } from 'vue';
  import Accordion from 'primevue/accordion';
  import AccordionPanel from 'primevue/accordionpanel';
  import AccordionHeader from 'primevue/accordionheader';
  import AccordionContent from 'primevue/accordioncontent';
  import Button from 'primevue/button';

  const active = ref('0');

  const faqItems = [
    {
      question: 'What is MOVE?',
      answer:
        'MOVE is a platform that provides video and live stream services specifically for sports content. We offer live matches, video highlights, exclusive interviews, and a variety of sports programs to connect fans with their favorite sports.',
    },
    {
      question: 'Do I need an account to use MOVE?',
      answer:
        "Yes, you need to register an account to access MOVE's main features, such as watching live streams, saving favorite videos, joining discussions, and creating personal content.",
    },
    {
      question: 'Which sports does MOVE support?',
      answer:
        'MOVE provides content for various sports, including: Football, Basketball, Tennis, Esports, Extreme Sports, And more...',
    },
    {
      question: 'Is MOVE free?',
      answer:
        'MOVE offers both free and paid content: Free content: Highlights, some live streams, and short videos. Paid content: Exclusive matches, major tournaments, and high-quality ad-free content via membership packages.',
    },
    {
      question: 'How can I subscribe to a membership package?',
      answer:
        'You can subscribe to MOVE\'s membership package by: Logging into your account, Selecting the "Membership Package" section on the website, Choosing the suitable package and paying through supported payment methods like credit cards, e-wallets, or bank transfer.',
    },
    {
      question: 'Can I watch MOVE on various devices?',
      answer:
        'MOVE supports watching on most devices: Computer (Windows/Mac), Smartphones and tablets (iOS/Android), Smart TVs and streaming devices like Chromecast, Roku.',
    },
    {
      question: 'I am facing video quality or connection issues, what should I do?',
      answer:
        "If you're facing issues with video quality or connection, you can: Check your internet speed (minimum 5 Mbps for live streaming), Refresh the page or restart the MOVE app, Ensure you're using the latest version of the MOVE browser or app. If the issue persists, please contact our Support Team.",
    },
    {
      question: 'Does MOVE support interaction features?',
      answer:
        'Yes, during live streams, you can: Join live chats to interact with the community, Participate in fan polls, Ask questions directly to athletes or coaches (if available).',
    },
    {
      question: 'Does MOVE have features for content creators?',
      answer:
        'Absolutely! MOVE supports content creators such as: Athletes, coaches, and clubs who want to share their journeys, Sports enthusiasts who want to create video content or stream live. Contact us to join as a creator.',
    },
    {
      question: 'How can I contact MOVE?',
      answer:
        'You can contact MOVE via: Email support: support@move.com, Hotline: 1800-123-456, Live Chat: Visit the "Contact" section on the website to chat with our support team.',
    },
    {
      question: 'Can I download videos on MOVE?',
      answer:
        'Currently, MOVE does not support downloading videos to your device. However, you can save your favorite videos in your account to watch them anytime.',
    },
    {
      question: 'Does MOVE support Vietnamese language?',
      answer:
        'Yes, MOVE provides an interface and content in multiple languages, including Vietnamese, to cater to users in Vietnam and globally.',
    },
  ];
</script>

<template>
  <div class="container mx-auto h-screen py-10 px-4 lg:px-20 mb-6">
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-black mb-4">FAQ</h1>
    </div>
    <div class="card">
      <div class="flex mb-4 gap-2 justify-end">
        <Button
          v-for="(item, index) in faqItems"
          :key="index"
          @click="active = String(index)"
          rounded
          :label="String(index + 1)"
          class="w-8 h-8 p-0"
          :outlined="active !== String(index)"
        />
      </div>

      <Accordion v-model:value="active">
        <AccordionPanel v-for="(item, index) in faqItems" :key="index" :value="String(index)">
          <AccordionHeader>{{ item.question }}</AccordionHeader>
          <AccordionContent>
            <p class="m-0" v-html="item.answer"></p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  </div>
</template>
