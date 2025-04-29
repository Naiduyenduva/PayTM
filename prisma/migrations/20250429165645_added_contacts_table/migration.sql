-- CreateTable
CREATE TABLE "Contacts" (
    "id" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "ContactName" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contacts_contactNumber_key" ON "Contacts"("contactNumber");

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
