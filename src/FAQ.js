import React, { useState } from 'react';

const faqData = [
  {
    question: "Where do I get the data for this visualization?",
    answer: "You need to request your Twitter archive from Twitter. You can do this by going to https://twitter.com/settings/your_twitter_data and requesting your archive. Once you have your archive, you need to download it and unzip it. The file you need is called 'data/tweets.js'."
  },
  {
    question: "Am I giving my Twitter archive to you?",
    answer: "No, you are giving your Twitter archive to me. I literally don't care about your data. And your data never leaves your computer anyway."
  },
  {
    question: "Do I need to select a timezone?",
    answer: "Yes, you need to select a timezone. This is because the data is given in UTC, and I need to convert it to your local time so that the visualization makes sense."
  },
  {
    question: "Is this dangerous?",
    answer: "As I said, I don't care about your data. But your tweeting patterns may reveal things about you that you don't want to share with the world such as when you are most active through the day. If you are concerned about this, you should not share this visualization with anyone you don't trust."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm">{question}</span>
        <span className="">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  );
};

const FAQ = () => {
  return (
    <div className="mt-12 bg-white shadow-lg rounded-lg p-6">
      <h2 className="font-bold mb-4">Things you may want to know</h2>
      {faqData.map((item, index) => (
        <FAQItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
};

export default FAQ;
