// Mental Health Tracker - Test Data Generator
// Copy and paste this script into your browser console to generate 2 weeks of test data

(() => {
  const moods = ['great', 'good', 'okay', 'low', 'struggling'];
  const notes = [
    "Had a productive day at work, feeling accomplished",
    "Spent time with friends, really helped my mood",
    "Feeling a bit overwhelmed with deadlines",
    "Exercise really made a difference today",
    "Struggling with anxiety about upcoming presentation",
    "Great therapy session, learned new coping strategies",
    "Had trouble sleeping, feeling tired",
    "Wonderful day outdoors, nature always helps",
    "Feeling grateful for my support system",
    "Challenging day but managed to stay positive",
    "Meditation session was very calming",
    "Work stress is getting to me",
    "Family dinner was exactly what I needed",
    "Feeling creative and motivated today",
    "Weather is affecting my mood negatively",
    "Accomplished a personal goal, feeling proud",
    "Having trouble focusing, mind feels scattered",
    "Good book and tea made for a peaceful evening",
    "Feeling lonely despite being around people",
    "Exercise class was energizing and fun",
    "Rough morning but afternoon got better",
    "Feeling optimistic about the future",
    "Stress levels are manageable today",
    "Had a meaningful conversation with a friend",
    "Feeling emotionally drained",
    "Beautiful sunset lifted my spirits",
    "Work meeting went better than expected",
    "Feeling stuck in a routine",
    "Random act of kindness made my day",
    "Dealing with some relationship stress"
  ];

  const reflectionQuestions = {
    'high': [
      "What are you most grateful for today?",
      "Did you celebrate something about yourself this week?",
      "How often did you feel deeply connected with others this week?",
      "Did you experience a \"flow state\" doing something you love?",
      "What's one way you can keep nurturing your current positive momentum?"
    ],
    'medium': [
      "Did you feel balanced between work, rest, and play today?",
      "What's something you accomplished today, big or small?",
      "Did you take time to check in with your emotions today?",
      "How well did you manage stress this week?",
      "Did you try something new or different this week?"
    ],
    'low': [
      "What's one small thing you can do today just for yourself?",
      "Did you allow yourself to rest when you needed it today?",
      "Who could you reach out to if you wanted support right now?",
      "When was the last time you felt safe or comforted?",
      "If today feels heavy, what's one thing that might make tomorrow just a little lighter?"
    ]
  };

  const reflectionAnswers = {
    'high': [
      "My family and good health",
      "Yes, I finished a project I'd been working on for weeks",
      "Several times, especially during our game night",
      "Yes, while painting yesterday - lost track of time completely",
      "Continue my morning meditation practice"
    ],
    'medium': [
      "Pretty well balanced, though work was busy",
      "I completed my daily walk and cooked a healthy meal",
      "Yes, I did a quick mood check during lunch",
      "Better than last week, using breathing exercises more",
      "Tried a new recipe and really enjoyed it"
    ],
    'low': [
      "Maybe take a warm bath tonight",
      "Yes, I took a nap when I felt overwhelmed",
      "My best friend is always there for me",
      "This morning when I had my coffee in the garden",
      "Planning something small and enjoyable for tomorrow"
    ]
  };

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateStressData(mood) {
    // Generate stress data based on mood
    let stress, depression, anxiety;
    
    switch(mood) {
      case 'great':
        stress = getRandomNumber(0, 2);
        depression = getRandomNumber(0, 1);
        anxiety = getRandomNumber(0, 2);
        break;
      case 'good':
        stress = getRandomNumber(1, 3);
        depression = getRandomNumber(0, 2);
        anxiety = getRandomNumber(1, 3);
        break;
      case 'okay':
        stress = getRandomNumber(2, 4);
        depression = getRandomNumber(1, 3);
        anxiety = getRandomNumber(2, 4);
        break;
      case 'low':
        stress = getRandomNumber(3, 5);
        depression = getRandomNumber(2, 4);
        anxiety = getRandomNumber(3, 5);
        break;
      case 'struggling':
        stress = getRandomNumber(4, 5);
        depression = getRandomNumber(3, 5);
        anxiety = getRandomNumber(4, 5);
        break;
      default:
        stress = 3;
        depression = 2;
        anxiety = 3;
    }

    // Calculate anxiety score based on stress levels
    const avgScore = (stress + depression + anxiety) / 3;
    // Add some randomness to make the chart more interesting
    const randomVariation = (Math.random() - 0.5) * 0.1; // ±0.05 variation
    const baseScore = 0.5 + ((avgScore) / 5) * 0.5; // Convert 0-5 average to 0.5-1.0 range
    const lifelongAnxietyScore = Math.max(0.5, Math.min(1.0, baseScore + randomVariation));
    const percentage = Math.round(lifelongAnxietyScore * 100);

    let category, className, emoji, message, questionType;
    
    if (lifelongAnxietyScore <= 0.60) {
      category = 'High Anxiety (Seek Support)';
      className = 'struggling';
      emoji = '😰';
      message = 'Your anxiety levels are quite high. Consider reaching out for professional support.';
      questionType = 'low';
    } else if (lifelongAnxietyScore <= 0.70) {
      category = 'Moderate Anxiety (Building Resilience)';
      className = 'low';
      emoji = '😔';
      message = 'You\'re experiencing some anxiety, but you\'re building resilience.';
      questionType = 'low';
    } else if (lifelongAnxietyScore <= 0.80) {
      category = 'Balanced State (Steady Progress)';
      className = 'neutral';
      emoji = '😐';
      message = 'You\'re in a balanced emotional state.';
      questionType = 'medium';
    } else if (lifelongAnxietyScore <= 0.90) {
      category = 'Low Anxiety (Thriving)';
      className = 'good';
      emoji = '😊';
      message = 'You\'re managing anxiety well and thriving!';
      questionType = 'high';
    } else {
      category = 'Optimal Mental Health (Flourishing)';
      className = 'thriving';
      emoji = '🌟';
      message = 'You\'re in an optimal mental health state!';
      questionType = 'high';
    }

    // Generate reflection responses
    const responses = {};
    const questionsToUse = reflectionQuestions[questionType];
    const answersToUse = reflectionAnswers[questionType];
    
    // Randomly answer 2-4 questions
    const numQuestions = getRandomNumber(2, 4);
    const questionIndices = [];
    while (questionIndices.length < numQuestions) {
      const index = getRandomNumber(0, questionsToUse.length - 1);
      if (!questionIndices.includes(index)) {
        questionIndices.push(index);
        responses[index] = answersToUse[index] || "Taking it one day at a time.";
      }
    }

    return {
      stressInputs: { stress, depression, anxiety },
      result: {
        category,
        className,
        emoji,
        message,
        percentage,
        lifelongScore: lifelongAnxietyScore.toFixed(3),
        rawModelOutput: (avgScore / 5).toFixed(4),
        questionData: {
          range: questionType,
          questions: questionsToUse
        }
      },
      reflectionResponses: responses
    };
  }

  function generateTestData() {
    const entries = [];
    const currentDate = new Date();
    
    // Generate 14 days of data (2 weeks)
    for (let i = 13; i >= 0; i--) {
      const entryDate = new Date(currentDate);
      entryDate.setDate(currentDate.getDate() - i);
      
      // Generate 1-2 entries per day
      const entriesPerDay = Math.random() > 0.3 ? 1 : 2;
      
      for (let j = 0; j < entriesPerDay; j++) {
        const mood = getRandomElement(moods);
        const hour = j === 0 ? getRandomNumber(8, 12) : getRandomNumber(16, 20);
        const minute = getRandomNumber(0, 59);
        
        entryDate.setHours(hour, minute, 0, 0);
        
        const entry = {
          id: Date.now() + Math.random() * 1000,
          date: entryDate.toLocaleDateString(),
          time: entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mood: mood,
          notes: Math.random() > 0.2 ? getRandomElement(notes) : "", // 80% chance of having notes
          sleepHours: Math.random() > 0.1 ? getRandomNumber(5, 10) + (Math.random() > 0.5 ? 0.5 : 0) : null,
          exerciseMinutes: Math.random() > 0.3 ? getRandomNumber(0, 120) : null,
          stressData: Math.random() > 0.4 ? generateStressData(mood) : null // 60% chance of stress data
        };
        
        entries.push(entry);
      }
    }
    
    // Sort entries by date/time (newest first)
    entries.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB - dateA;
    });
    
    return entries;
  }

  // Generate and save test data
  console.log('🗑️ Clearing old mental health data...');
  localStorage.removeItem('mentalHealthEntries');
  
  console.log('🎯 Generating 2 weeks of mental health test data...');
  
  const testEntries = generateTestData();
  
  // Save to localStorage
  localStorage.setItem('mentalHealthEntries', JSON.stringify(testEntries));
  
  console.log(`✅ Generated ${testEntries.length} test entries!`);
  console.log('📊 Data breakdown:');
  
  const moodCounts = {};
  const stressDataCount = testEntries.filter(e => e.stressData).length;
  
  testEntries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  console.log('   Moods:', moodCounts);
  console.log(`   Entries with stress assessments: ${stressDataCount}`);
  console.log(`   Entries with notes: ${testEntries.filter(e => e.notes).length}`);
  console.log(`   Entries with sleep data: ${testEntries.filter(e => e.sleepHours).length}`);
  console.log(`   Entries with exercise data: ${testEntries.filter(e => e.exerciseMinutes).length}`);
  
  console.log('\n🔄 Reload the page to see your test data!');
  
  // Optionally reload the page automatically
  if (confirm('Test data generated! Would you like to reload the page to see it?')) {
    window.location.reload();
  }

})();