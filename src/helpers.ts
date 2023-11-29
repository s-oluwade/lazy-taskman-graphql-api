import OpenAI from 'openai';
// import {animations} from './animations/animationMapping';

export async function getGPTSubtasks(prompt: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Respond with only the title for each subtask.',
      },
      {
        role: 'user',
        content: `Generate subtasks for the following task: \n` + prompt,
      },
    ],
    max_tokens: 100,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.choices[0].message;

  return quote;
}

// const animationKeys = Object.keys(animations).join(',');
export async function getAnimationGPT(label: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: '',
      },
      {
        role: 'user',
        content:
          '[' +
          // animationKeys +
          ']' +
          '\n' +
          `From the above list of tags, choose at least one that is contextually similar to the word: \n` +
          label,
        // `\n` +
        // `Then give me a random one from the selection`,
      },
    ],
    max_tokens: 100,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.choices[0].message;

  // if (quote.content && animationKeys.includes(quote.content)) {
  //   return quote.content;
  // }

  return 'default';
}

export async function generateLabelGPT(prompt: string) {
  if (!prompt || prompt.length < 2) return Promise.reject('Task length too short');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'Responses should not contain quotes',
      },
      {
        role: 'user',

        content: `Generate a one-word label for the following task: \n` + prompt,
      },
    ],
    max_tokens: 100,
    temperature: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
  });

  const quote = completion.choices[0].message;

  return quote;
}
