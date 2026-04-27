import { CheckCircle, Clock, XCircle, Download, Eye, Sparkle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { mockBilling } from "../../data/mock-user"

function PlanCard({ billing }: { billing: typeof mockBilling }) {
  const isPro = billing.planType.toLowerCase() === "professional"

  if (isPro) {
    return (
      <div className="p-4 rounded-xl bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Sparkle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-base font-bold">{billing.planType}</div>
              <div className="text-xs text-primary-foreground/70">Full clinical scribe suite</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold">${billing.invoices[0]?.amount}</div>
            <div className="text-xs text-primary-foreground/70">amount/month</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl border bg-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="text-base font-bold">{billing.planType}</div>
            <div className="text-xs text-muted-foreground">Basic clinical scribe suite</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-bold">Free</div>
          <div className="text-xs text-muted-foreground">forever</div>
        </div>
      </div>
    </div>
  )
}

export function BillingSettings() {
  const billing = mockBilling

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg">
      {/* Plan Card */}
      <PlanCard billing={billing} />

      {/* Payment Method */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Payment Method</h3>
        <div className="p-3 rounded-xl border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardBrandIcon type={billing.card.type} />
            <div>
              <div className="text-sm font-medium">
                {billing.card.type} ending in {billing.card.last4}
              </div>
              <div className="text-xs text-muted-foreground">
                Expires {billing.card.expiry}
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-3 justify-end">
          <Button variant="outline" size="sm">Update Card</Button>
          <Button variant="destructive" size="sm">Cancel Subscription</Button>
        </div>
      </div>

      {/* Invoice History */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Invoice History</h3>
        <div className="border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left font-medium text-muted-foreground px-4 py-2">Invoice</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-2">Date</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-2">Amount</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-2">Status</th>
                <th className="text-left font-medium text-muted-foreground px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {billing.invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{invoice.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(invoice.date)}</td>
                  <td className="px-4 py-3">${invoice.amount}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted cursor-pointer" title="View">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-muted cursor-pointer" title="Download">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function StatusBadge({ status }: { status: "paid" | "pending" | "failed" }) {
  const config = {
    paid: { 
      icon: CheckCircle, 
      className: "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400" 
    },
    pending: { 
      icon: Clock, 
      className: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" 
    },
    failed: { 
      icon: XCircle, 
      className: "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400" 
    },
  }[status]

  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function CardBrandIcon({ type }: { type: string }) {
  const brand = type.toLowerCase()
  const icons: Record<string, string> = {
    visa: "/icons/billing/icons8-visa-96.png",
    mastercard: "/icons/billing/mastercard_82049.png",
    amex: "/icons/billing/icons8-amex-96.png",
    rupay: "/icons/billing/icons8-rupay-96.png",
  }

  const src = icons[brand] || "/icons/billing/icons8-credit-card-96.png"

  return (
    <img src={src} alt={type} className="h-8 w-auto rounded" />
  )
}
