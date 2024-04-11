export interface Course {
  id: string
  title: string
  description?: string
  icons?: string[]
  cost: number
  status?: string
  image?: string
}

export const courses: Course[] = [
  {
    id: "figma",
    title: "Figma Alapjai Kurzus",
    description:
      "Ez a kurzus arra szolgál, hogy átadja a megfelelő alap tudást a Figma nevű dizájnerprogram használatához",
    icons: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
    ],
    image:
      "https://images.unsplash.com/photo-1605907126120-f68611516ecc?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    cost: 0,
    status: "ready",
  },
  {
    id: "webdev",
    title: "Webfejlesztés Alapjai",
    icons: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
    ],
    image:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=3732&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Ez a kurzus arra szolgál, hogy átadja a megfelelő alap tudást a webfejlesztés alapjainak elsajátitásához",
    cost: 0,
  },
]
