'use client'

import {
  useAgent,
  CopilotSidebar,
  useFrontendTool,
  useComponent,
} from '@copilotkit/react-core/v2'
import { CopilotKitCSSProperties } from '@copilotkit/react-ui'
import { useState } from 'react'
import z from 'zod'

export default function CopilotKitPage() {
  const [themeColor, setThemeColor] = useState('#6366f1')

  useFrontendTool({
    name: 'setThemeColor',
    description: 'Set the theme color of the page.',
    parameters: z.object({
      themeColor: z
        .string()
        .describe('The theme color to set. Make sure to pick nice colors.'),
    }),
    handler: async ({ themeColor }) => {
      setThemeColor(themeColor)
    },
  })

  return (
    <main
      style={
        { '--copilot-kit-primary-color': themeColor } as CopilotKitCSSProperties
      }>
      <YourMainContent themeColor={themeColor} />

      <CopilotSidebar defaultOpen={true} labels={{}} />
    </main>
  )
}

function YourMainContent({ themeColor }: { themeColor: string }) {
  const { agent } = useAgent({
    agentId: 'starterAgent',
  })

  useFrontendTool(
    {
      name: 'addProverb',
      description: 'Add a proverb to the list.',
      parameters: z.object({
        proverb: z
          .string()
          .describe('The proverb to add. Make it witty, short and concise.'),
      }),

      handler: async ({ proverb }) => {
        agent.setState({
          ...agent.state,
          proverbs: [...(agent.state.proverbs || []), proverb],
        })
      },
    },
    [agent],
  )

  useComponent({
    name: 'showWeather',
    description: 'Display a weather card for a city.',
    parameters: z.object({
      location: z.string(),
    }),
    render: ({ location }) => {
      return <WeatherCard location={location} themeColor={themeColor} />
    },
  })

  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="flex h-screen w-screen flex-col items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-2xl rounded-2xl bg-white/20 p-8 shadow-xl backdrop-blur-md">
        <h1 className="mb-2 text-center text-4xl font-bold text-white">
          Proverbs
        </h1>
        <p className="mb-6 text-center text-gray-200 italic">
          This is a demonstrative page, but it could be anything you want! 🪁
        </p>
        <hr className="my-6 border-white/20" />
        <div className="flex flex-col gap-3">
          {(agent.state.proverbs as any[])?.map((proverb, index) => (
            <div
              key={index}
              className="group relative rounded-xl bg-white/15 p-4 text-white transition-all hover:bg-white/20">
              <p className="pr-8">{proverb}</p>
              <button
                onClick={() =>
                  agent.setState({
                    ...agent.state,
                    proverbs: (agent.state.proverbs as any[])?.filter(
                      (_, i) => i !== index,
                    ),
                  })
                }
                className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600">
                ✕
              </button>
            </div>
          ))}
        </div>
        {agent.state.proverbs?.length === 0 && (
          <p className="my-8 text-center text-white/80 italic">
            No proverbs yet. Ask the assistant to add some!
          </p>
        )}
      </div>
    </div>
  )
}

// Simple sun icon for the weather card
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-14 w-14 text-yellow-200">
      <circle cx="12" cy="12" r="5" />
      <path
        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        strokeWidth="2"
        stroke="currentColor"
      />
    </svg>
  )
}

// Weather card component where the location and themeColor are based on what the agent
// sets via tool calls.
function WeatherCard({
  location,
  themeColor,
}: {
  location?: string
  themeColor: string
}) {
  return (
    <div
      style={{ backgroundColor: themeColor }}
      className="mt-6 mb-4 w-full max-w-md rounded-xl shadow-xl">
      <div className="w-full bg-white/20 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white capitalize">
              {location}
            </h3>
            <p className="text-white">Current Weather</p>
          </div>
          <SunIcon />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className="text-3xl font-bold text-white">70°</div>
          <div className="text-sm text-white">Clear skies</div>
        </div>

        <div className="mt-4 border-t border-white pt-4">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-white">Humidity</p>
              <p className="font-medium text-white">45%</p>
            </div>
            <div>
              <p className="text-xs text-white">Wind</p>
              <p className="font-medium text-white">5 mph</p>
            </div>
            <div>
              <p className="text-xs text-white">Feels Like</p>
              <p className="font-medium text-white">72°</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
