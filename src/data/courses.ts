export type Lesson = {
  id: string;
  title: string;
  duration: string;
  summary: string;
  objectives: string[];
  sections: { heading:string; body:string }[];
  reflection: string;
};

export type Course = {
  id: string;
  eyebrow: string;
  title: string;
  promise: string;
  duration: string;
  rating: string;
  tone: string;
  access: 'OPEN ACCESS' | 'MEMBERS ONLY';
  overview: string;
  resources: string[];
  lessons: Lesson[];
};

const cvLessons:Lesson[]=[
  {id:'recruiter-scan',title:'What recruiters notice first',duration:'6 min',summary:'Understand the first review and what earns attention.',objectives:['Recognise the first things recruiters scan','Create a clear visual hierarchy','Remove details that distract from your value'],sections:[{heading:'The first scan is fast',body:'Recruiters often begin with a quick relevance check. Your name, professional direction, recent experience and strongest evidence should be easy to locate without effort.'},{heading:'Make relevance obvious',body:'Use a focused profile, familiar headings and concise evidence. The goal is not to include everything. It is to make the right information easy to understand.'}],reflection:'What is the first useful thing someone notices on your current CV?'},
  {id:'strong-profile',title:'Writing a powerful profile',duration:'8 min',summary:'Turn your opening paragraph into a focused professional story.',objectives:['Write a concise professional direction','Connect strengths to the role','Avoid vague claims and clichés'],sections:[{heading:'Lead with direction',body:'A strong profile names the work you are moving toward and the value you can already offer. Keep it specific enough to feel credible.'},{heading:'Evidence beats adjectives',body:'Replace phrases like “hard-working team player” with a skill, context or result that helps the reader understand what you have done.'}],reflection:'Write one sentence that connects your strongest skill to the opportunity you want.'},
  {id:'evidence',title:'Showing evidence of your skills',duration:'10 min',summary:'Use outcomes and action language, even without formal roles.',objectives:['Turn responsibilities into evidence','Use strong action language','Find experience beyond paid jobs'],sections:[{heading:'Experience is broader than employment',body:'Projects, volunteering, student leadership, freelance work and community responsibilities can all demonstrate useful skills when described clearly.'},{heading:'Show action and result',body:'Begin with what you did, add the context, then show the outcome or learning. Numbers help when they are honest and meaningful.'}],reflection:'Which project best proves one of the skills your target role requires?'},
  {id:'structure',title:'Structuring your experience',duration:'7 min',summary:'Organise education, skills and experience around relevance.',objectives:['Choose useful section headings','Prioritise recent relevant evidence','Keep formatting consistent'],sections:[{heading:'Structure guides attention',body:'Place the sections most relevant to your target opportunity earlier. A student CV may lead with education and projects; another may lead with experience.'},{heading:'Consistency builds trust',body:'Use the same date style, heading hierarchy, spacing and bullet structure throughout the document.'}],reflection:'Which section should move higher on your CV for the role you want?'},
  {id:'final-checklist',title:'The final CV checklist',duration:'6 min',summary:'Polish every detail before sending your application.',objectives:['Check clarity and accuracy','Remove avoidable errors','Tailor the CV to the opportunity'],sections:[{heading:'Review in layers',body:'First check relevance, then evidence, then structure, and finally spelling and formatting. Trying to fix everything at once makes errors easier to miss.'},{heading:'Tailor before sending',body:'Use the opportunity description to confirm that your strongest matching skills and experience are visible.'}],reflection:'What is the one improvement your CV needs before your next application?'},
  {id:'next-application',title:'Your next application',duration:'5 min',summary:'Turn your learning into a practical application plan.',objectives:['Choose a suitable opportunity','Create a tailoring checklist','Plan your next action'],sections:[{heading:'Use the course immediately',body:'Choose one real opportunity and apply what you have learned while the ideas are fresh. Save a master CV, then tailor a copy for each application.'},{heading:'Your simple workflow',body:'Read the description, highlight required evidence, tailor your profile and strongest bullets, complete the final checklist, then submit confidently.'}],reflection:'Which opportunity will you use to put this course into practice?'},
];

function previewLesson(id:string,title:string):Lesson{return{id,title,duration:'8 min',summary:'A focused lesson with practical guidance.',objectives:['Understand the core idea','Apply it to your own development'],sections:[{heading:'Lesson preview',body:'This course will use the same guided lesson experience as Build a CV That Gets Noticed. Full learning content will be added in the content phase.'}],reflection:'What is one action you can take after this lesson?'};}

export const courses:Record<string,Course>={
  'workplace-foundations':{id:'workplace-foundations',eyebrow:'CAREER ESSENTIALS',title:'Build a CV that gets noticed',promise:'Turn your experience into a clear, confident CV that opens doors.',duration:'42 min',rating:'4.9',tone:'#A81455',access:'OPEN ACCESS',overview:'A practical, example-led course designed to help you explain your value clearly and apply with confidence.',resources:['CV checklist','Action-word bank','Editable CV planner'],lessons:cvLessons},
  'public-speaking':{id:'public-speaking',eyebrow:'COMMUNICATION SKILLS',title:'Confident Public Speaking',promise:'Structure your message and speak with greater clarity and calm.',duration:'58 min',rating:'4.8',tone:'#3E45E8',access:'MEMBERS ONLY',overview:'Short lessons and guided practice for presentations and interviews.',resources:['Presentation planner','Practice scorecard'],lessons:['Know your audience','Build a memorable message','Use your voice well','Confident body language','Handling nerves','Presenting online','Your practice presentation'].map((title,index)=>previewLesson(`lesson-${index+1}`,title))},
  budgeting:{id:'budgeting',eyebrow:'SMART MONEY GIRL',title:'Budgeting Without the Stress',promise:'Build a realistic budget that fits your actual life.',duration:'36 min',rating:'4.9',tone:'#D99A20',access:'OPEN ACCESS',overview:'A shame-free introduction to intentional money decisions.',resources:['Monthly budget sheet','Expense tracker'],lessons:['Where your money goes','Needs, wants and priorities','Build your first budget','Create a weekly money rhythm'].map((title,index)=>previewLesson(`lesson-${index+1}`,title))},
  'self-leadership':{id:'self-leadership',eyebrow:'LEADERSHIP DEVELOPMENT',title:'Leading Yourself First',promise:'Build ownership, self-awareness and dependable habits.',duration:'48 min',rating:'4.8',tone:'#111111',access:'OPEN ACCESS',overview:'Build the habits and confidence to lead from where you are.',resources:['Values exercise','Habit builder'],lessons:['What self-leadership means','Know your values','Own your choices','Build dependable habits','Your leadership plan'].map((title,index)=>previewLesson(`lesson-${index+1}`,title))},
};
