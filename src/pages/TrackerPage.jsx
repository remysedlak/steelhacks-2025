import { useState, useEffect } from 'react'
import EntryForm from '../components/tracker/EntryForm'
import EntriesList from '../components/tracker/EntriesList'

const TrackerPage = () => {
  const [entries, setEntries] = useState([])

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('mentalHealthEntries')
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        setEntries(parsedEntries)
        console.log('✅ Loaded entries from localStorage:', parsedEntries.length, 'entries')
      } catch (error) {
        console.error('❌ Error parsing saved entries:', error)
        localStorage.removeItem('mentalHealthEntries')
      }
    } else {
      console.log('📝 No saved entries found in localStorage')
    }
  }, [])

  // Save entries to localStorage whenever entries change
  useEffect(() => {
    if (entries.length > 0) {
      localStorage.setItem('mentalHealthEntries', JSON.stringify(entries))
      console.log('💾 Saved', entries.length, 'entries to localStorage')
    }
  }, [entries])

  const handleNewEntry = (newEntry) => {
    setEntries([newEntry, ...entries])
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
          Mental Health Tracker
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Track your daily mood, sleep, and activities to better understand your mental health patterns.
        </p>
      </div>

      <EntryForm onSubmit={handleNewEntry} />
      <EntriesList entries={entries} />
    </div>
  )
}

export default TrackerPage