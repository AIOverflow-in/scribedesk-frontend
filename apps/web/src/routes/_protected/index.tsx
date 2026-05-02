import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/")({
  loader: () => {
    throw redirect({ to: "/scribe" })
  },
})

// ─── Dashboard overview — commented out, swap back later ───
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
//
// function OverviewIndex() {
//   return (
//     <div className="flex flex-col gap-4">
//       <div>
//         <h1 className="text-3xl font-bold">Welcome back</h1>
//         <p className="text-muted-foreground">Here is an overview of your clinical workspace.</p>
//       </div>
//
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Projects</CardTitle>
//             <CardDescription>Active projects this month</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">12</div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardHeader>
//             <CardTitle>Tasks</CardTitle>
//             <CardDescription>Pending tasks</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">24</div>
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardHeader>
//             <CardTitle>Messages</CardTitle>
//             <CardDescription>Unread messages</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-3xl font-bold">8</div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
