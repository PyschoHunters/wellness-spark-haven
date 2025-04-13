
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, ArrowRight, AtSign, Lock } from 'lucide-react'

const Login = () => {
  const { signIn, signUp, loading } = useAuth()
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white px-4">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-fitness-primary/20 to-fitness-secondary/20 -z-10"></div>
      
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="mx-auto mb-4 w-12 h-12 bg-fitness-primary rounded-full flex items-center justify-center">
            <Activity className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-fitness-primary to-fitness-secondary bg-clip-text text-transparent">
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
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                    <Link to="#" className="text-xs text-fitness-primary font-medium hover:underline">
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
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-fitness-primary hover:bg-fitness-primary/90 text-black font-medium transition-all"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  {!loading && <ArrowRight className="ml-2" size={16} />}
                </Button>
              </CardFooter>
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
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
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
                      className="pl-10 h-12 bg-gray-50 border-gray-200"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Password must be at least 6 characters long
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-fitness-primary hover:bg-fitness-primary/90 text-black font-medium transition-all"
                  disabled={loading}
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  {!loading && <ArrowRight className="ml-2" size={16} />}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>

        <div className="px-8 pb-8 pt-2 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our
            <Link to="#" className="text-fitness-primary font-medium hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="#" className="text-fitness-primary font-medium hover:underline ml-1">Privacy Policy</Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Login
