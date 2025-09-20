// Mental Health Tracker - 1 Week Test Data (9/14/2025 - 9/20/2025)
// Copy and paste this script into your browser console

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
    "Feeling creative and motivated today"
  ];

  const reflectionAnswers = [
    "My family and good health",
    "Yes, I finished a project I'd been working on for weeks", 
    "Several times, especially during our game night",
    "Yes, while painting yesterday - lost track of time completely",
    "Continue my morning meditation practice",
    "Pretty well balanced, though work was busy",
    "I completed my daily walk and cooked a healthy meal",
    "Yes, I did a quick mood check during lunch",
    "Better than last week, using breathing exercises more",
    "Maybe take a warm bath tonight",
    "Yes, I took a nap when I felt overwhelmed",
    "My best friend is always there for me",
    "This morning when I had my coffee in the garden",
    "Planning something small and enjoyable for tomorrow"
  ];

  function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function generateStressData(mood) {
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

    const avgScore = (stress + depression + anxiety) / 3;
    const randomVariation = (Math.random() - 0.5) * 0.15; // More variation
    const baseScore = 0.5 + ((avgScore) / 5) * 0.5;
    const lifelongAnxietyScore = Math.max(0.5, Math.min(1.0, baseScore + randomVariation));
    const percentage = Math.round(lifelongAnxietyScore * 100);

    let category, className, emoji, message;
    
    if (lifelongAnxietyScore <= 0.60) {
      category = 'High Anxiety (Seek Support)';
      className = 'struggling';
      emoji = '😰';
      message = 'Your anxiety levels are quite high. Consider reaching out for professional support.';
    } else if (lifelongAnxietyScore <= 0.70) {
      category = 'Moderate Anxiety (Building Resilience)';
      className = 'low';
      emoji = '😔';
      message = 'You\'re experiencing some anxiety, but you\'re building resilience.';
    } else if (lifelongAnxietyScore <= 0.80) {
      category = 'Balanced State (Steady Progress)';
      className = 'neutral';
      emoji = '😐';
      message = 'You\'re in a balanced emotional state.';
    } else if (lifelongAnxietyScore <= 0.90) {
      category = 'Low Anxiety (Thriving)';
      className = 'good';
      emoji = '😊';
      message = 'You\'re managing anxiety well and thriving!';
    } else {
      category = 'Optimal Mental Health (Flourishing)';
      className = 'thriving';
      emoji = '🌟';
      message = 'You\'re in an optimal mental health state!';
    }

    // Generate 2-3 reflection responses
    const responses = {};
    const numQuestions = getRandomNumber(2, 3);
    for (let i = 0; i < numQuestions; i++) {
      responses[i] = getRandomElement(reflectionAnswers);
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
          questions: [
            "What are you most grateful for today?",
            "Did you take time to check in with your emotions today?",
            "How well did you manage stress this week?",
            "What's something you accomplished today, big or small?",
            "Did you spend time doing something that brings you joy today?"
          ]
        }
      },
      reflectionResponses: responses
    };
  }

  // Clear old data
  console.log('🗑️ Clearing old data...');
  localStorage.removeItem('mentalHealthEntries');

  // Generate 1 week of data (Sept 14-20, 2025)
  console.log('📅 Generating 1 week of data (Sept 14-20, 2025)...');
  
  const entries = [];
  const today = new Date(2025, 8, 20); // September 20, 2025 (month is 0-indexed)
  
  // Generate 7 days of data
  for (let i = 6; i >= 0; i--) {
    const entryDate = new Date(today);
    entryDate.setDate(today.getDate() - i);
    
    // 1-2 entries per day
    const entriesPerDay = Math.random() > 0.4 ? 1 : 2;
    
    for (let j = 0; j < entriesPerDay; j++) {
      const mood = getRandomElement(moods);
      const hour = j === 0 ? getRandomNumber(8, 12) : getRandomNumber(17, 21);
      const minute = getRandomNumber(0, 59);
      
      entryDate.setHours(hour, minute, 0, 0);
      
      const entry = {
        id: Date.now() + Math.random() * 1000,
        date: entryDate.toLocaleDateString(),
        time: entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mood: mood,
        notes: Math.random() > 0.2 ? getRandomElement(notes) : "",
        sleepHours: Math.random() > 0.1 ? getRandomNumber(6, 9) + (Math.random() > 0.5 ? 0.5 : 0) : null,
        exerciseMinutes: Math.random() > 0.3 ? getRandomNumber(15, 90) : null,
        stressData: Math.random() > 0.3 ? generateStressData(mood) : null // 70% chance
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
  
  // Save to localStorage
  localStorage.setItem('mentalHealthEntries', JSON.stringify(entries));
  
  console.log(`✅ Generated ${entries.length} entries for 1 week!`);
  console.log('📊 Summary:');
  
  const moodCounts = {};
  entries.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
  });
  
  console.log('   Moods:', moodCounts);
  console.log(`   Stress assessments: ${entries.filter(e => e.stressData).length}`);
  console.log(`   Notes: ${entries.filter(e => e.notes).length}`);
  console.log(`   Sleep data: ${entries.filter(e => e.sleepHours).length}`);
  console.log(`   Exercise data: ${entries.filter(e => e.exerciseMinutes).length}`);
  
  console.log('\n🔄 Refresh the page to see your week of data!');
  
  if (confirm('1 week of test data generated! Reload the page?')) {
    window.location.reload();
  }
})();