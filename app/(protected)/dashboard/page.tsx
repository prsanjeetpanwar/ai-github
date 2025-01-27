"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import UseProject from "@/hooks/use-project";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";
import DashboardPageSkeleton from "./DashBoardSkelaton";
import ArchiveButton from "./archive-button";
import InviteButton from "./inviteButton";
import TeamMember from "./team-member";

const DashboardPage = () => {
  const { user } = useUser();
  const { project, projects, projectId } = UseProject();

  // Render a loading state if the data isn't ready
  if (!project) {
    return <DashboardPageSkeleton/>
  }

  return (
    <div className="p-4">
     
      <div className="flex items-center justify-between flex-wrap gap-y-4">
        <div className="w-fit rounded-md bg-primary px-4 py-2">
          <div className="flex items-center">
            <Github className="text-white size-5" />
            <div className="ml-2">
              <p className="text-sm font-medium text-white">
                This project links to{" "}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLink className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
        <div className="flex items-center gap-4">
          {/* Team members */}
         <TeamMember/>
         <InviteButton/>
          <ArchiveButton/>
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <AskQuestionCard/>
          <MeetingCard/>
        </div>
      </div>

      <div className="mt-5">
        <CommitLog />
      </div>
    </div>
  );
};

export default DashboardPage;
