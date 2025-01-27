
"use client"
import React, { FormEvent, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import UseProject from '@/hooks/use-project';
import { readStreamableValue } from 'ai/rsc';
import { askQuestion } from './action';
import MDEditor from '@uiw/react-md-editor';
import { CodeReferences } from './code-referances';
import { api } from '@/trpc/react';
import { toast } from 'sonner';
import Image from 'next/image';
import useRefetch from '@/hooks/use-refatch';
// import "@uiw/react-md-editor/markdown-editor.css"; // Default styles
// import "@uiw/react-md-editor/markdown.css"; // Markdown styles

interface FileReference {
  fileName: string;
  sourceCode: string; 
  summary: string;
}
const AskQuestionCard = () => {
  const { project,projectId } = UseProject();
  const [question, setQuestion] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileReferences, setFileReferences] =useState<FileReference[]>([]);
  const [answer, setAnswer] = useState('');
  // const savedAnswer=api.project.savedAnswer.useMutation()
  const savedAnswer=api.project.savedAnswer.useMutation()

  

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!projectId) {
      console.error('No project ID available');
      return;
    }

    try {
      setOpen(true);
      setLoading(true);
      setAnswer('');
      setFileReferences([]);

      const { output, fileReference } = await askQuestion(question, project.id);
      setFileReferences(fileReference);

      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          setAnswer((prev) => prev + delta);
        }
      }
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('An error occurred while processing your question.');
    } finally {
      setLoading(false);
    }
  };
  const refetch=useRefetch()
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <div  className='flex items-center gap-2'>
            <DialogTitle>
              {/* <div className="h-4 w-4">Logo</div> */}
            <Image src="/new.png" alt="logo" width={40} height={40}/>
            </DialogTitle>
            <Button variant="outline" disabled={savedAnswer.isPending}
            onClick={()=>{
              savedAnswer.mutate({
                projectId: project!.id,
                question,
                answer,
                filesReferences: fileReferences, 
              },{
                onSuccess:()=>{
                  toast.success("Answer saved successfully")
                  refetch()
                },
                onError:()=>{
                  toast.error("Error saving answer")
                }
              });
            }}
            >
              Saved Answer
            </Button>
            </div>
            
          </DialogHeader>
         
          <MDEditor.Markdown
  source={answer}
  className="max-w-[70vw] h-full max-h-[40vh]   overflow-auto"
  style={{ 
    backgroundColor: 'white', 
    color: "black",
  
  }}
/>
            <CodeReferences filesReferences={fileReferences}/>
            <Button onClick={() => setOpen(false)}>
              Close
            </Button>
           
        
        </DialogContent>
      </Dialog>

      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Ask Dionysus!'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default AskQuestionCard;