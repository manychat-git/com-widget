import { GraphData } from './types';

export const sampleData: GraphData = {
  nodes: [
    {
      id: 'a1',
      type: 'article',
      title: 'Robots & Red Lace',
      description: 'Exploring the intersection of AI and human creativity',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/671fa6b106217cf3b311fe44_Feature_A2-3.avif',
      x: 0,
      y: 0,
      z: 0
    },
    {
      id: 'v1',
      type: 'youtube_video',
      title: 'From Mr. Beast to Mr. Least?',
      description: 'Analysis of content creator evolution',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/671fa5604eacaedf503f2cd6_Feature_A2-2.avif',
      x: 50,
      y: 0,
      z: 0
    },
    {
      id: 'sp1',
      type: 'special_project',
      title: 'Parental Discretion (Still) Advised',
      description: 'Modern guide to content moderation',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/671fa6caa89e547b3bd93e0e_Feature_A3.avif',
      x: -50,
      y: 0,
      z: 0
    },
    {
      id: 'a2',
      type: 'article',
      title: "It's 2024 and — Wait, Email Doesn't Suck?",
      description: 'The renaissance of email marketing',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/671fa6e6883fde668bb72aea_Feature_A5-1.avif',
      x: 0,
      y: 50,
      z: 0
    },
    {
      id: 'v2',
      type: 'youtube_video',
      title: 'Cardboard Pizza: The Deadly Art of Losing Your Social Media Credibility',
      description: 'Case study of social media authenticity',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/671fa7127645f993bf2f0470_Feature_A2-4.avif',
      x: 0,
      y: -50,
      z: 0
    },
    {
      id: 'a3',
      type: 'article',
      title: 'Fur-Ever Famous',
      description: 'Pet influencers and digital marketing',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6745a6b288a0d4961d7ec2a9_4_Feature_A1.avif',
      x: 25,
      y: 25,
      z: 0
    },
    {
      id: 'sp2',
      type: 'special_project',
      title: "Engagement Dread: It's Not Your Fault (But It Kinda Is?)",
      description: 'Deep dive into social media anxiety',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6745a74615e706bbc37165f8_4_Feature_A5.avif',
      x: -25,
      y: 25,
      z: 0
    },
    {
      id: 'a4',
      type: 'article',
      title: 'Still Posting Post-Death',
      description: 'Digital legacy in the age of AI',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6746f84a23ad26938dddd3c8_Feature_A3.avif',
      x: 25,
      y: -25,
      z: 0
    },
    {
      id: 'sp3',
      type: 'special_project',
      title: 'Mercy Kill Your Online Persona',
      description: 'Guide to digital reinvention',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6745a77d1aa6309002cd2f80_4_Feature_A4.avif',
      x: -25,
      y: -25,
      z: 0
    },
    {
      id: 'v3',
      type: 'youtube_video',
      title: "Prove You're Human",
      description: 'The battle against bots and AI',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6745a7bfefbafc1c8e5fc26d_4_Feature_A2.avif',
      x: 40,
      y: 40,
      z: 0
    },
    {
      id: 'a5',
      type: 'article',
      title: "What's Your Creator Fortune?",
      description: 'Future trends in content creation',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/676aea529861bfd54580285b_Feature_A3com5.jpg',
      x: -40,
      y: 40,
      z: 0
    },
    {
      id: 'sp4',
      type: 'special_project',
      title: "That's Not On My Bingo Card: 2025 edition",
      description: 'Predictions for social media trends',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/676aea64f1ad8bf1a6a48f0e_Feature_A4com5.jpg',
      x: 40,
      y: -40,
      z: 0
    },
    {
      id: 'a6',
      type: 'article',
      title: 'The Parasocial Paradox',
      description: 'Understanding creator-audience relationships',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/676aea780211dcaef8d6a5fd_Feature_A1com5.jpg',
      x: -40,
      y: -40,
      z: 0
    },
    {
      id: 'v4',
      type: 'youtube_video',
      title: 'Have Influencers Peaked?',
      description: 'Analysis of influencer marketing trends',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/676aead53185ee11f9b23527_Feature_A2com5-1.jpg',
      x: 15,
      y: 15,
      z: 0
    },
    {
      id: 'sp5',
      type: 'special_project',
      title: 'Right & Wrong Reasons to Expand',
      description: 'Strategic growth in digital media',
      imageUrl: 'https://cdn.prod.website-files.com/66b0cbf53f3798cc2ace2b42/6797639025be2e8f0c27d2f7_Feature_A1.jpg',
      x: -15,
      y: 15,
      z: 0
    }
  ],
  links: [
    { source: 'a1', target: 'v1', strength: 0.8 },
    { source: 'a1', target: 'sp1', strength: 0.6 },
    { source: 'v1', target: 'a2', strength: 0.7 },
    { source: 'sp1', target: 'v2', strength: 0.9 },
    { source: 'a2', target: 'a3', strength: 0.5 },
    { source: 'v2', target: 'sp2', strength: 0.8 },
    { source: 'a3', target: 'a4', strength: 0.7 },
    { source: 'sp2', target: 'sp3', strength: 0.6 },
    { source: 'a4', target: 'v3', strength: 0.9 },
    { source: 'sp3', target: 'a5', strength: 0.7 },
    { source: 'v3', target: 'sp4', strength: 0.8 },
    { source: 'a5', target: 'a6', strength: 0.6 },
    { source: 'sp4', target: 'v4', strength: 0.7 },
    { source: 'a6', target: 'sp5', strength: 0.9 },
    { source: 'v4', target: 'a1', strength: 0.8 }
  ]
};