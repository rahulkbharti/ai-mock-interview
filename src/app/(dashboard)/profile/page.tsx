import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Calendar, Settings, LogOut, Award, Star } from "lucide-react";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      sessions: {
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      }
    }
  });

  if (!user) redirect("/login");

  const totalSessions = user.sessions.length;
  const avgScore = totalSessions > 0 
    ? Math.round(user.sessions.reduce((acc, s) => acc + (s.totalScore || 0), 0) / totalSessions)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="relative group">
        <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full -z-10" />
        <Card className="bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/20 shadow-2xl">
                {user.image ? (
                  <Image 
                    src={user.image} 
                    alt={user.name || "User"} 
                    width={128} 
                    height={128}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-16 h-16 text-zinc-600" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl shadow-xl">
                <Star className="w-4 h-4 text-white fill-current" />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
                <p className="text-zinc-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge className="bg-indigo-500/10 text-indigo-400 border-none px-4 py-1.5 rounded-full font-bold">
                  Pro Member
                </Badge>
                <Badge className="bg-zinc-800 text-zinc-400 border-none px-4 py-1.5 rounded-full font-bold">
                  Rank #128
                </Badge>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl border-zinc-800 hover:bg-zinc-800 h-12 px-6">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl p-8 space-y-4">
          <div className="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Avg Score</p>
            <p className="text-3xl font-black text-white">{avgScore}%</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl p-8 space-y-4">
          <div className="bg-green-500/10 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Sessions</p>
            <p className="text-3xl font-black text-white">{totalSessions}</p>
          </div>
        </Card>

        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl p-8 space-y-4">
          <div className="bg-yellow-500/10 w-12 h-12 rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Member Since</p>
            <p className="text-xl font-bold text-white">May 2026</p>
          </div>
        </Card>
      </div>

      {/* Recent Activity Mini-List */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-white px-2">Account Details</h2>
        <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden">
          <div className="divide-y divide-zinc-800/50">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-800 p-3 rounded-xl">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Public Profile</p>
                  <p className="text-zinc-500 text-xs">Visible to other candidates</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-zinc-800">Edit</Button>
            </div>
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-zinc-800 p-3 rounded-xl">
                  <Mail className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-white font-bold">Email Notifications</p>
                  <p className="text-zinc-500 text-xs">Manage your alerts</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="rounded-lg border-zinc-800">Manage</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="pt-4">
        <Button variant="destructive" className="w-full h-14 rounded-2xl font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out Account
        </Button>
      </div>
    </div>
  );
}
