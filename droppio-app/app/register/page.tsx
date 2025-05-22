"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Gift, Twitter, Youtube } from "lucide-react"
import { useRouter } from "next/navigation"
import CreatorRegistration from '@/components/CreatorRegistration';

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Register as a Creator</h1>
      <CreatorRegistration />
    </div>
  );
}
