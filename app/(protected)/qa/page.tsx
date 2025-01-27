"use client";

import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import UseProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import React, { useState } from "react";
import AskQuestionCard from "../dashboard/ask-question-card";
import MDEditor from "@uiw/react-md-editor";
import { CodeReferences } from "../dashboard/code-referances";

const Page = () => {
  const { projectId } = UseProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions?.[questionIndex];

  return (
    <div className="p-4">
    <Sheet >
      <AskQuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold">Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((q, index) => (
          <React.Fragment key={q.id}>
            <SheetTrigger onClick={() => setQuestionIndex(index)}>
              <div
                className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-border"
              >
                <img
                  src={q.user.imageUrl ?? ""}
                  alt=""
                  className="rounded-full"
                  height={30}
                  width={30}
                />
                <div className="text-left flex flex-col">
                  <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                    {q.question}
                  </p>
                  <span className="text-xs text-gray-300 whitespace-nowrap">
                    {new Date(q.createdAt).toDateString()}
                  </span>
                </div>
                <p className="text-gray-500 line-clamp-1 text-sm">{q.answer}</p>
              </div>
            </SheetTrigger>
          </React.Fragment>
        ))}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw] overflow-auto">
         <SheetHeader className="mt-8">
          <span className="text-lg font-semibold">{question.question}?</span>
          <MDEditor.Markdown source={question.answer}/>
          <CodeReferences filesReferences={(question.filesReferences ??[]) as any} />
         </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
    </div>
  );
};

export default Page;
