import prisma from "@/app/lib/db";

// 👇 ADD THIS LINE. It forces the page to refresh data on every visit.
export const dynamic = 'force-dynamic';

export default async function ReleaseDashboard() {
  const notes = await prisma.releaseNote.findMany({
    orderBy: { mergedAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-12 border-b-2 border-blue-500 pb-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              SHIPLOG <span className="text-blue-600">🚀</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Automated UAT Release Intelligence</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full">
              Live Feed Active
            </span>
          </div>
        </header>

        <div className="grid gap-8">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{note.title}</h2>
                    <time className="text-sm text-gray-400 font-mono">
                      {new Date(note.mergedAt).toLocaleString()}
                    </time>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {note.author[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Merged by {note.author}</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-sm text-gray-500 italic">{note.repoName}</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Release Summary</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {note.body || "No technical description provided for this release."}
                    </p>
                  </div>
                  
                   {/* Optional: Add the Link Button if you want to see the PR */}
                   <div className="mt-4 text-right">
                      <a href={note.prUrl} target="_blank" className="text-blue-600 text-sm font-bold hover:underline">
                        View PR →
                      </a>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">No release notes detected yet.</p>
              <p className="text-gray-500 text-sm mt-2">Merge a PR to your <strong>main</strong> branch to see the magic happen.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}