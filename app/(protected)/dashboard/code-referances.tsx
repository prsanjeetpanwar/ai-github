import { LoadingSpinner } from '@/components/loading-sppinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter'));

import React, { useState, useEffect } from 'react';
import { Suspense, lazy } from 'react';
import { Prism as Highlight } from 'react-syntax-highlighter';

import { dracula, lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dark, vs } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Props = {
  filesReferences: { fileName: string; sourceCode: string; summary: string }[];
};

export const CodeReferences = ({ filesReferences }: Props) => {
  const [tab, setTabs] = useState<string | null>(filesReferences[0]?.fileName || null);
  if (filesReferences.length === 0) return null;

  return (
    <div className="max-w-[70vw]">
      <Tabs onValueChange={setTabs} value={tab} className="">
        <div className="overflow-scroll scroll-smooth flex gap-2 bg-gray-200 p-1 rounded-md">
          {filesReferences.map(file => (
            <button
              key={file.fileName}
              value={file.fileName}
              onClick={() => setTabs(file.fileName)}
              className={cn(
                `px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-muted-foreground whitespace-nowrap hover:bg-muted`,
                {
                  'bg-gray-100 text-black': tab === file.fileName,
                }
              )}
            >
              {file.fileName}
            </button>
          ))}
        </div>
        {filesReferences.map(file => (
          <TabsContent
            key={file.fileName}
            value={file.fileName}
            className="max-h-[40vh] mt-4 overflow-auto max-w-7xl rounded-md scrollbar-hide"
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Highlight language="typescript" style={lucario}>
                {file.sourceCode}
              </Highlight>
            </Suspense>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
