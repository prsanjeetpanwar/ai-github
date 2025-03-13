"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Code, FileCode, GitBranch, GitCommit, GitPullRequest, MessageSquare } from 'lucide-react';
import UseProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const RepoInsightsPage = () => {
  const { project, projectId } = UseProject();
  const [selectedTab, setSelectedTab] = useState('commits');
  const [timeSpan, setTimeSpan] = useState('week');
  
  // Fetch commits with actual data from your schema
  const { data: commits, isLoading: isLoadingCommits } = api.project.getCommits.useQuery(
    { projectId, limit: 10 },
    { enabled: !!projectId }
  );
  
  // Fetch source code embeddings data
  const { data: sourceFiles, isLoading: isLoadingSourceFiles } = api.project.getSourceCodeEmbeddings.useQuery(
    { projectId, limit: 10 },
    { enabled: !!projectId }
  );
  
  // Fetch questions asked about this repository
  const { data: questions, isLoading: isLoadingQuestions } = api.project.getQuestions.useQuery(
    { projectId },
    { enabled: !!projectId }
  );

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Extract filenames from questions' filesReferences
  const getReferencedFiles = (filesReferences) => {
    try {
      if (!filesReferences) return [];
      const parsedRefs = typeof filesReferences === 'string' 
        ? JSON.parse(filesReferences) 
        : filesReferences;
      
      // Assuming filesReferences contains array of objects with fileName property
      return parsedRefs.map(ref => ref.fileName || ref.name || 'Unnamed file');
    } catch (error) {
      console.error("Error parsing file references:", error);
      return [];
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Repository Insights</h1>
          <p className="text-sm text-muted-foreground">
            Analyze code, commits and questions for {project?.name || 'your repository'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeSpan} onValueChange={setTimeSpan}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Refresh Data</Button>
        </div>
      </div>

      {/* Repository Overview Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="font-semibold text-xl">
                {project?.name || <Skeleton className="h-7 w-48" />}
              </h2>
              <p className="text-sm text-muted-foreground break-all">
                {project?.githubUrl || <Skeleton className="h-5 w-72 mt-1" />}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-blue-50 rounded-md px-3 py-2 text-blue-700 flex items-center gap-2">
                <GitCommit className="h-4 w-4" />
                <div>
                  <p className="text-xs">Total Commits</p>
                  <p className="font-semibold">{commits?.length || 0}</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded-md px-3 py-2 text-purple-700 flex items-center gap-2">
                <FileCode className="h-4 w-4" />
                <div>
                  <p className="text-xs">Indexed Files</p>
                  <p className="font-semibold">{sourceFiles?.length || 0}</p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-md px-3 py-2 text-amber-700 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <div>
                  <p className="text-xs">Questions</p>
                  <p className="font-semibold">{questions?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs defaultValue="commits" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="commits" className="flex items-center gap-1">
            <GitCommit className="h-4 w-4" />
            <span>Commits</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-1">
            <FileCode className="h-4 w-4" />
            <span>Files</span>
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>Questions</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Commits Tab */}
        <TabsContent value="commits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>
                Latest code changes in your repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCommits ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="py-3 border-b last:border-0">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : commits?.length ? (
                <ScrollArea className="h-[400px] pr-4">
                  {commits.map((commit) => (
                    <div key={commit.id} className="py-3 border-b last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={commit.commitAuthorAvatar || "/placeholder-avatar.png"} 
                            alt={commit.commitAuthorName} 
                            className="h-8 w-8 rounded-full" 
                          />
                          <div>
                            <h3 className="font-medium">{commit.commitMessage}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <span>{commit.commitAuthorName}</span> • 
                              <span>{formatDate(commit.commitDate)}</span>
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-mono text-xs">
                          {commit.commitHash.substring(0, 7)}
                        </Badge>
                      </div>
                      {commit.summary && (
                        <p className="mt-2 text-sm pl-11">{commit.summary}</p>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No commits found for this repository</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Indexed Files</CardTitle>
              <CardDescription>
                Source code files indexed from your repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSourceFiles ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="py-3 border-b last:border-0">
                    <Skeleton className="h-6 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))
              ) : sourceFiles?.length ? (
                <ScrollArea className="h-[400px] pr-4">
                  {sourceFiles.map((file) => (
                    <div key={file.id} className="py-3 border-b last:border-0">
                      <div className="flex items-start gap-3">
                        <Code className="h-5 w-5 text-muted-foreground mt-1" />
                        <div>
                          <h3 className="font-medium">{file.fileName}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{file.summary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No files have been indexed yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions & Answers</CardTitle>
              <CardDescription>
                Questions asked about this repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingQuestions ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="py-4 border-b last:border-0">
                    <Skeleton className="h-6 w-2/3 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : questions?.length ? (
                <ScrollArea className="h-[400px] pr-4">
                  {questions.map((question) => (
                    <div key={question.id} className="py-4 border-b last:border-0">
                      <h3 className="font-medium text-lg">{question.question}</h3>
                      <p className="text-sm mt-2 mb-3">{question.answer.substring(0, 200)}...</p>
                      
                      {question.filesReferences && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Referenced Files:</p>
                          <div className="flex flex-wrap gap-1">
                            {getReferencedFiles(question.filesReferences).map((fileName, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {fileName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-3">
                        Asked on {formatDate(question.createdAt)}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No questions have been asked yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RepoInsightsPage;