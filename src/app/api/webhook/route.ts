import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const TARGET_BRANCH = 'main'; 

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // --- DEBUGGING LOGS (Check your terminal for this!) ---
    console.log("------------------------------------------------");
    console.log("🔔 INCOMING WEBHOOK:");
    console.log(`- Event Action: ${data.action}`);
    console.log(`- Is Pull Request?: ${data.pull_request ? 'YES' : 'NO'}`);
    
    if (data.pull_request) {
      console.log(`- Merged Status: ${data.pull_request.merged}`);
      console.log(`- Target Branch: '${data.pull_request.base.ref}' (We want: '${TARGET_BRANCH}')`);
    }
    // -----------------------------------------------------

    const pr = data.pull_request;

    // The Logic Gate
    if (
      data.action === 'closed' && 
      pr?.merged && 
      pr.base.ref === TARGET_BRANCH
    ) {
      await prisma.releaseNote.create({
        data: {
          githubId: pr.id.toString(),
          title: pr.title,
          body: pr.body || "No description provided.",
          author: pr.user.login,
          mergedAt: new Date(pr.merged_at),
          repoName: data.repository.full_name,
          repoUrl: data.repository.html_url,
          prUrl: pr.html_url
        }
      });

      console.log(`✅ SUCCESS: Note created for ${pr.title}`);
      return NextResponse.json({ message: "Created" }, { status: 201 });
    }

    console.log("⚠️ IGNORED: Conditions not met.");
    console.log("------------------------------------------------");
    return NextResponse.json({ message: "Ignored" }, { status: 200 });

  } catch (error) {
    console.error("❌ ERROR:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}