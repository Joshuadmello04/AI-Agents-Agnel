"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Clock, DollarSign, AlertTriangle, Truck, Ship, Plane } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { RouteMap } from "@/components/route-map"
import type { RoutePath } from "@/lib/types"

interface RouteCardProps {
  route: RoutePath
  index: number
}

export function RouteCard({ route, index }: RouteCardProps) {
  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'land':
        return <Truck className="w-4 h-4" />
      case 'sea':
        return <Ship className="w-4 h-4" />
      case 'air':
        return <Plane className="w-4 h-4" />
      default:
        return null
    }
  }

  const getTransportColor = (mode: string) => {
    switch (mode) {
      case 'land':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'sea':
        return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
      case 'air':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default:
        return ''
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all duration-300 group">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Route {index + 1}</span>
              <Badge variant="outline" className="group-hover:bg-primary/20 transition-colors">
                {route.edges.length} segments
              </Badge>
            </CardTitle>
            <CardDescription>Click to view detailed route information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{route.time_sum.toFixed(1)}h</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-medium">${route.price_sum.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CO2</p>
                  <p className="font-medium">{route.CO2_sum.toFixed(1)}kg</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-background/95 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle>Route {index + 1} Details</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] w-full mb-6 overflow-hidden rounded-lg border border-white/10">
          <RouteMap route={route} />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2 text-emerald-500 mb-2">
                <Clock className="w-5 h-5" />
                <h4 className="font-semibold">Total Time</h4>
              </div>
              <p className="text-2xl font-bold">{route.time_sum.toFixed(1)} <span className="text-base font-normal text-muted-foreground">hours</span></p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2 text-blue-500 mb-2">
                <DollarSign className="w-5 h-5" />
                <h4 className="font-semibold">Total Cost</h4>
              </div>
              <p className="text-2xl font-bold">${route.price_sum.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center space-x-2 text-yellow-500 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="font-semibold">CO2 Emissions</h4>
              </div>
              <p className="text-2xl font-bold">{route.CO2_sum.toFixed(1)} <span className="text-base font-normal text-muted-foreground">kg</span></p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h4 className="font-semibold mb-4">Route Steps</h4>
            <div className="space-y-3">
              {route.edges.map((edge, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-3 p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{edge.from}</span>
                      <span className="text-primary">→</span>
                      <span className="font-medium">{edge.to}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`flex items-center space-x-2 ${getTransportColor(edge.mode)}`}
                  >
                    {getTransportIcon(edge.mode)}
                    <span>{edge.mode}</span>
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}