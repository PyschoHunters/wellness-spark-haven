
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, ArrowRight, AtSign, Lock, CheckCircle2, Github } from 'lucide-react'

const Login = () => {
  const { signIn, signUp, signInWithGithub, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'login') {
      await signIn(email, password)
    } else {
      await signUp(email, password)
    }
  }

  const handleGithubSignIn = async () => {
    await signInWithGithub()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <div className="hidden lg:flex flex-col w-1/2 p-12 justify-center items-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="max-w-md">
          <div className="mx-auto mb-8 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Activity className="text-indigo-600" size={32} />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">
            Your Journey to Better Health Starts Here
          </h1>
          
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of users who have transformed their lives with our personalized fitness approach.
          </p>
          
          <div className="space-y-6">
            {[
              "Personalized workout plans tailored to your goals",
              "Track your progress with detailed analytics",
              "Connect with a community of fitness enthusiasts", 
              "Access to expert-designed workout programs"
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="mr-3 text-green-400 shrink-0 mt-0.5" size={20} />
                <p className="text-white">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto mb-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center lg:hidden">
              <Activity className="text-white" size={28} />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to FitTrack
            </CardTitle>
            <CardDescription className="text-base">
              {activeTab === 'login' 
                ? 'Sign in to your account to continue your fitness journey' 
                : 'Create a new account to start your fitness journey today'}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-sm">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                      <Link to="#" className="text-xs text-indigo-600 font-medium hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                    {!loading && <ArrowRight className="ml-2" size={16} />}
                  </Button>
                  
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 absolute w-full"></div>
                    <div className="bg-white px-4 z-10 text-sm text-gray-500">or continue with</div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 border-gray-200"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                  >
                    <Github size={20} className="mr-2" />
                    GitHub
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="register-email" 
                        type="email" 
                        placeholder="email@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        id="register-password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                    {!loading && <ArrowRight className="ml-2" size={16} />}
                  </Button>
                  
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-gray-200 absolute w-full"></div>
                    <div className="bg-white px-4 z-10 text-sm text-gray-500">or continue with</div>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full h-12 border-gray-200"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                  >
                    <Github size={20} className="mr-2" />
                    GitHub
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>

          <div className="px-8 pb-8 pt-2 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our
              <Link to="#" className="text-indigo-600 font-medium hover:underline mx-1">Terms of Service</Link>
              and
              <Link to="#" className="text-indigo-600 font-medium hover:underline ml-1">Privacy Policy</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login
