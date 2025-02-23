"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  Github,
  Code2,
  MessageSquareText,
  GitBranch,
  Rocket,
  AlertCircle,
  ArrowRight,
  Zap,
  MapPin,
  Phone

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const floating = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const gradientMove = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const Page = () => {
  const controls = useAnimation();
  const founderRef = useRef(null);
  const isInView = useInView(founderRef, { once: true, margin: "-100px" });

  useEffect(() => {
    controls.start("animate");
  }, [controls]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 overflow-hidden">
      {/* Enhanced Animated Gradient Background */}
      <motion.div 
        {...gradientMove}
        className="absolute inset-0 "
      />

      {/* Enhanced Particle Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 8 + 2,
              height: Math.random() * 8 + 2,
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 6 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="backdrop-blur-xl p-6 fixed w-full z-10 ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div {...fadeIn} className="flex items-center space-x-2">
            <Code2 className="text-gray-300 h-6 w-6" />
            <span className="text-xl font-bold text-gray-100">
              GitSense AI
            </span>
          </motion.div>
          
          <motion.div {...fadeIn} className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all"
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-300 hover:text-white hover:bg-gray-700/30 transition-all"
            >
              Pricing
            </Button>
            <Button className="bg-gray-100 text-gray-900 hover:bg-gray-300 group shadow-lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            {...fadeIn}
            className="text-6xl font-bold mb-6 text-gray-100"
          >
            Revolutionize Your Codebase Understanding
          </motion.h1>
          
          <motion.p 
            {...fadeIn}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered insights into your GitHub repositories with commit analysis, 
            intelligent Q&A, and automated documentation generation
          </motion.p>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-block"
          >
            <Button className="h-14 px-8 text-lg bg-gray-100 text-gray-900 hover:bg-gray-300 group shadow-lg">
              <Github className="mr-2 h-5 w-5 text-gray-900" />
              Connect GitHub Repository
            </Button>
          </motion.div>

          <div className="mt-12 flex justify-center gap-4 flex-wrap">
            {['TypeScript', 'React', 'Python', 'Go', 'Rust', 'Java'].map((lang, i) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                className="px-4 py-2 bg-gray-800 rounded-full text-sm backdrop-blur-lg border border-gray-700"
              >
                {lang}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
      <section className="pt-32 pb-20 px-6 text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div 
            {...fadeIn}
            className="inline-block mb-8 overflow-hidden rounded-2xl border border-gray-700"
          >
            <div className="px-4 py-2 bg-gray-800 text-sm font-medium backdrop-blur-lg">
              🚀 Now Public Beta Available!
            </div>
          </motion.div>
          
          <motion.h1 
            {...fadeIn}
            className="text-6xl font-bold mb-6 bg-gradient-to-b from-gray-100 to-gray-400 bg-clip-text text-transparent leading-tight"
          >
            Revolutionize Your<br/>Codebase Understanding
          </motion.h1>
          
          {/* Interactive Code Block */}
          <motion.div 
            className="relative mx-auto w-full max-w-3xl mt-12"
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-30" />
            <motion.div
              className="p-8 bg-gray-800 rounded-xl border border-gray-700 backdrop-blur-xl text-left"
              variants={{
                hover: { y: -5 }
              }}
            >
              <div className="font-mono text-sm space-y-4">
                <div className="flex gap-4 items-center text-purple-400">
                  <span>~/projects</span>
                  <span className="text-gray-500">❯</span>
                  <span>gitsense init</span>
                </div>
                <div className="text-emerald-400">✔ Successfully connected to GitHub</div>
                <div className="text-blue-400">Analyzing 42 repositories...</div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      {/* Features Grid */}
    

      <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            {...fadeIn} 
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-b from-gray-100 to-gray-400 bg-clip-text text-transparent"
          >
            Powerful Features for Developers
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, type: "spring" }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-8 bg-gray-800 hover:bg-gray-700/30 transition-all group border border-gray-700 backdrop-blur-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-300 w-fit p-3 rounded-lg mb-6">
                      <feature.icon className="h-8 w-8 text-gray-900" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-100">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Interactive Demo Section */}
      <section className="py-20 px-6 relative">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto rounded-3xl overflow-hidden border border-gray-700 bg-gray-800 backdrop-blur-xl"
        >
          <div className="p-8 bg-gray-700/20">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <motion.div 
                {...floating}
                className="flex-1 space-y-6 p-8 bg-gray-900 rounded-xl border border-gray-700"
              >
                <div className="font-mono text-sm space-y-4">
                  <div className="text-gray-400">// AI-generated documentation</div>
                  <div className="text-blue-400">function</div>
                  <div className="ml-4">
                    <span className="text-blue-300">async</span>{' '}
                    <span className="text-green-400">analyzeCodebase</span>
                    <span className="text-white">() {'{'}</span>
                  </div>
                  <div className="ml-8 text-blue-400">const insights = await</div>
                  <div className="ml-8 text-gray-400">AI.generateDocumentation();</div>
                  <div className="ml-4 text-white">{'}'}</div>
                </div>
              </motion.div>
              
              <div className="flex-1 space-y-8">
                <motion.div
                  initial={{ x: 50 }}
                  whileInView={{ x: 0 }}
                  className="p-6 bg-gray-900 rounded-xl border border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <MessageSquareText className="h-6 w-6 text-gray-100" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-gray-100">Smart Code Analysis</h4>
                      <p className="text-gray-300 text-sm">
                        Real-time AI-powered suggestions and documentation generation
                        based on your code patterns.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 50 }}
                  whileInView={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 bg-gray-900 rounded-xl border border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <GitBranch className="h-6 w-6 text-gray-100" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-gray-100">Branch Insights</h4>
                      <p className="text-gray-300 text-sm">
                        Visualize and optimize your Git workflow with intelligent
                        branch management recommendations.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section 
        ref={founderRef}
        className="py-20 px-6 relative bg-gradient-to-br from-gray-900 via-gray-900/50 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
          >
            {/* 3D Card Effect */}
            <motion.div 
              className="relative group perspective-1000"
              whileHover="hover"
              initial={{ rotateY: 0 }}
              variants={{
                hover: { rotateY: 10 }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-30" />
              <Card className="p-8 bg-gray-800 border border-gray-700 rounded-3xl backdrop-blur-xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="flex flex-col items-center md:items-start gap-8">
                  <motion.div
                    className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-gray-700"
                    initial={{ scale: 0.9 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-300">P</span>
                    </div>
                  </motion.div>
                  <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-3xl font-bold bg-gradient-to-b from-gray-100 to-gray-300 bg-clip-text text-transparent">
                      Prsanjeet
                    </h3>
                    <p className="text-gray-400">Founder & Lead Developer</p>
                    <div className="flex flex-col gap-2 text-gray-300">
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -20 }}
                        animate={isInView ? { x: 0 } : {}}
                        transition={{ delay: 0.4 }}
                      >
                        <MapPin className="h-4 w-4" />
                        <span>Devnarayan Colony, Bhim, Rajasthan</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ x: -20 }}
                        animate={isInView ? { x: 0 } : {}}
                        transition={{ delay: 0.6 }}
                      >
                        <Phone className="h-4 w-4" />
                        <span>+91 9352768977</span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Founder Story */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-b from-gray-100 to-gray-300 bg-clip-text text-transparent">
                Our Vision
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Building GitSense AI from the ground up, I wanted to create something that truly understands developers' needs. Having worked with complex codebases myself, I recognized the need for intelligent tools that can surface insights hidden in commit histories and code patterns.
              </p>
              <div className="flex gap-4">
                <Button className="bg-gray-100 text-gray-900 hover:bg-gray-300">
                  Read Full Story
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300">
                  View GitHub Profile
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>


     
    </div>
  );
};

const FEATURES = [
  {
    icon: GitBranch,
    title: "Commit Intelligence",
    description: "Deep analysis of commit history with AI-powered insights and pattern detection"
  },
  {
    icon: Code2,
    title: "Codebase Explorer",
    description: "Natural language interface to query and understand complex codebases"
  },
  {
    icon: MessageSquareText,
    title: "Smart Collaboration",
    description: "Real-time documentation sync and team knowledge sharing powered by AI"
  }
];

export default Page;