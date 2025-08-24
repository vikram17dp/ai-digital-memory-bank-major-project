import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { DashboardMainLayout } from "@/components/dashboard-main-layout"
import { DashboardContent } from "@/components/dashboard-content-new"

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect("/")
  }

  // Convert the Clerk user object to a plain object with only serializable properties
  const serializableUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddresses[0]?.emailAddress || "",
    imageUrl: user.imageUrl,
  }

  return (
    <DashboardMainLayout user={serializableUser}>
      <DashboardContent />
    </DashboardMainLayout>
  )
}
