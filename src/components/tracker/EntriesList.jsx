import React, { useState } from 'react'
import EntryCard from './EntryCard'

const EntriesList = ({ entries }) => {
  const [showAllEntries, setShowAllEntries] = useState(false)

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
          <span className="text-3xl mr-3">📚</span>
          Recent Entries
        </h2>
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No entries yet</h3>
          <p className="text-gray-500">Start tracking your mood above to see your journey!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
        <span className="text-3xl mr-3">📚</span>
        Recent Entries
      </h2>
      
      <div className="space-y-4">
        {/* Show recent entries (first 5) */}
        {entries.slice(0, 5).map((entry) => (
          <EntryCard key={entry.id} entry={entry} isCompact={false} />
        ))}
        
        {/* Show more entries button/dropdown */}
        {entries.length > 5 && (
          <div className="mt-6">
            <button
              onClick={() => setShowAllEntries(!showAllEntries)}
              className="w-full bg-gradient-to-r from-gray-100 to-blue-100 text-gray-700 py-3 px-6 rounded-xl hover:from-gray-200 hover:to-blue-200 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <span>{showAllEntries ? 'Hide Older Entries' : `View ${entries.length - 5} Older Entries`}</span>
              <span>{showAllEntries ? '▲' : '▼'}</span>
            </button>
            
            {/* Older entries (collapsible) */}
            {showAllEntries && (
              <div className="mt-4 space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">📚 Older Journal Entries</h3>
                {entries.slice(5).map((entry) => (
                  <EntryCard key={entry.id} entry={entry} isCompact={true} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EntriesList