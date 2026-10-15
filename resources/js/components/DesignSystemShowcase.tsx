import React, { useState } from 'react'
import {
  Button,
  SocialButton,
  Input,
  PasswordInput,
  PhoneInput,
  Select,
  Checkbox,
  Radio,
  ToggleSwitch,
  Slider,
  Badge,
  Card,
  Avatar,
  SegmentedControl,
  Modal,
} from './ui'
import { colors, typography } from '../design-system/tokens'
import { ArrowRight, Bell, Sparkles, Upload } from 'lucide-react'

export const DesignSystemShowcase: React.FC = () => {
  const [toggleState, setToggleState] = useState(true)
  const [checkboxState, setCheckboxState] = useState(true)
  const [radioState, setRadioState] = useState('female')
  const [sliderVal, setSliderVal] = useState(65)
  const [tabVal, setTabVal] = useState<'upload' | 'history'>('upload')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [password, setPassword] = useState('Secret123')
  const [phone, setPhone] = useState('8012345678')

  return (
    <div className="min-h-screen bg-[#FDFBFD] p-6 sm:p-12 font-sans text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b border-neutral-200 pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge variant="accent" size="sm" className="mb-2">
              Design System & Tokens v1.0
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-display uppercase tracking-wide text-primary">
              Pregnancy Build Your Blood
            </h1>
            <p className="text-neutral-600 mt-2 text-base">
              Comprehensive Tailwind-powered Design System based on Figma specifications.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            rightIcon={<Sparkles className="w-4 h-4" />}
          >
            Preview Modal
          </Button>
        </div>

        {/* 1. Color Palette Tokens */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">1. Color Tokens & Shades</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Extracted from Figma <code className="text-primary font-mono text-xs">Shades.png</code> and mapped to Tailwind utilities.
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary Purple */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-neutral-800">
                  Primary Purple (#800090) — Shades 0 to 10
                </span>
                <span className="text-xs text-neutral-500 font-mono">bg-primary-*</span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-11 gap-2">
                {Object.entries(colors.primary.shades).map(([shade, hex]) => (
                  <div key={shade} className="flex flex-col items-center">
                    <div
                      className="w-full h-14 rounded-xl border border-neutral-200 shadow-subtle flex items-end p-1.5"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="text-[10px] font-mono font-medium drop-shadow-sm text-white mix-blend-difference">
                        {shade}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-1">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Accent Lilac */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-neutral-800">
                  Accent Lilac (#ECD4ED) — Shades 0 to 10
                </span>
                <span className="text-xs text-neutral-500 font-mono">bg-accent-*</span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-11 gap-2">
                {Object.entries(colors.accent.shades).map(([shade, hex]) => (
                  <div key={shade} className="flex flex-col items-center">
                    <div
                      className="w-full h-14 rounded-xl border border-neutral-200 shadow-subtle flex items-end p-1.5"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="text-[10px] font-mono font-medium drop-shadow-sm text-neutral-800">
                        {shade}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-1">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary Blue */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-neutral-800">
                  Secondary Blue (#89CFF0) — Shades 0 to 10
                </span>
                <span className="text-xs text-neutral-500 font-mono">bg-secondary-*</span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-11 gap-2">
                {Object.entries(colors.secondary.shades).map(([shade, hex]) => (
                  <div key={shade} className="flex flex-col items-center">
                    <div
                      className="w-full h-14 rounded-xl border border-neutral-200 shadow-subtle flex items-end p-1.5"
                      style={{ backgroundColor: hex }}
                    >
                      <span className="text-[10px] font-mono font-medium drop-shadow-sm text-neutral-800">
                        {shade}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 mt-1">{hex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Typography Specimen */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">2. Typography Scale</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Matching <code className="text-primary font-mono text-xs">Typography.jpg</code> with Anton (Display) and DM Sans (UI).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Anton Display */}
            <Card rounded="3xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                  Display Typography — Anton
                </span>
                <code className="text-xs font-mono text-neutral-400">font-display</code>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">3xl — 30px / 38px</span>
                  <p className="font-display text-3xl uppercase tracking-wide">
                    BUILD YOUR BLOOD TODAY
                  </p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">2xl — 24px / 32px</span>
                  <p className="font-display text-2xl uppercase tracking-wide">
                    2,450 TOTAL REFERRAL POINTS
                  </p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">xl — 20px / 30px</span>
                  <p className="font-display text-xl uppercase tracking-wide">
                    340 PREGNANCY PCV RECORD
                  </p>
                </div>
              </div>
            </Card>

            {/* DM Sans UI */}
            <Card rounded="3xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-primary">
                  UI & Body Typography — DM Sans
                </span>
                <code className="text-xs font-mono text-neutral-400">font-sans</code>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">Text 2xl (Bold) — 24px / 32px</span>
                  <p className="font-sans text-2xl font-bold">Welcome back, Sarah</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">Text lg (Semibold) — 18px / 28px</span>
                  <p className="font-sans text-lg font-semibold">Pregnancy Safeguarding Tools</p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">Text md (Regular) — 16px / 24px</span>
                  <p className="font-sans text-md text-neutral-700">
                    Track your packed cell volume (PCV) and refer fellow expecting mothers.
                  </p>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block mb-0.5">Text sm / xs (Medium) — 14px / 12px</span>
                  <p className="font-sans text-sm font-medium text-neutral-500">
                    JPG, PNG, PDF, HEIC/WebP supported • minimum 8 characters
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* 3. CTA Buttons & Social Buttons */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">3. Buttons & Actions</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Matching <code className="text-primary font-mono text-xs">CTA BUTTONS.png</code> and <code className="text-primary font-mono text-xs">Social media buttons.png</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CTA Buttons */}
            <Card rounded="3xl" className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                CTA Button States (Pill rounded-full)
              </span>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>
                  Primary Action Button
                </Button>
                <Button variant="secondary" fullWidth>
                  Secondary Outline Button
                </Button>
                <Button variant="primary" disabled fullWidth>
                  Disabled Button
                </Button>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Button variant="light" size="sm">
                  Light Pill
                </Button>
                <Button variant="white" size="sm">
                  White Card
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost Button
                </Button>
                <Button variant="primary" size="sm" isLoading>
                  Loading
                </Button>
              </div>
            </Card>

            {/* Social Media Buttons */}
            <Card rounded="3xl" className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Social Sign-In Buttons
              </span>
              <div className="space-y-3">
                <SocialButton provider="google" />
                <SocialButton provider="facebook" />
                <SocialButton provider="apple" />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <span className="text-xs text-neutral-500">Icon Only:</span>
                <SocialButton provider="google" variant="icon" />
                <SocialButton provider="facebook" variant="icon" />
                <SocialButton provider="apple" variant="icon" />
              </div>
            </Card>
          </div>
        </section>

        {/* 4. Form Controls */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">4. Form Inputs & States</h2>
            <p className="text-sm text-neutral-500 mt-1">
              Matching <code className="text-primary font-mono text-xs">Input.png</code> with label, error, hint, password toggle, and phone prefix.
            </p>
          </div>

          <Card rounded="3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                placeholder="linda@framcreative.com"
                hint="This is a hint text."
              />
              <Input
                label="Email (Error State)"
                defaultValue="invalid-email@"
                error="This is an error message."
              />

              <PhoneInput
                label="Phone Number"
                defaultValue="7012345678"
                hint="This is a hint text."
              />
              <PhoneInput
                label="Phone Number (Error State)"
                defaultValue="000"
                error="incorrect number"
              />

              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hint="Click eye to toggle visibility"
              />
              <PasswordInput
                label="Password (Error State)"
                defaultValue="short"
                error="Password must be at least 8 characters"
                isRequirementMet={false}
              />

              <Select
                label="Category / City"
                placeholder="Select city of residence"
                options={[
                  { label: 'Lagos, Nigeria', value: 'lagos' },
                  { label: 'Abuja, Nigeria', value: 'abuja' },
                  { label: 'Port Harcourt, Nigeria', value: 'ph' },
                ]}
              />

              <Input
                label="Disabled Input"
                disabled
                defaultValue="Read only value"
              />
            </div>
          </Card>
        </section>

        {/* 5. Toggles, Radios, Checkbox, Slider, Tabs */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">
              5. Interactive Controls & Selection
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Matching <code className="text-primary font-mono text-xs">Other Buttons.png</code> and <code className="text-primary font-mono text-xs">PCV.png</code>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Toggles and Selection */}
            <Card rounded="3xl" className="space-y-5">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Toggle Switches & Checkboxes
              </span>

              <div className="space-y-4">
                <ToggleSwitch
                  checked={toggleState}
                  onChange={setToggleState}
                  label="SMS Notifications"
                  description="Receive blood test reminders"
                />

                <div className="pt-2 border-t border-neutral-100 flex flex-col gap-3">
                  <Checkbox
                    checked={checkboxState}
                    onChange={(e) => setCheckboxState(e.target.checked)}
                    label="I agree to terms"
                    description="Allow my PCV data for study"
                  />
                  <Checkbox
                    checked={false}
                    disabled
                    label="Disabled Checkbox"
                  />
                </div>
              </div>
            </Card>

            {/* Radios */}
            <Card rounded="3xl" className="space-y-5">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Radio Buttons
              </span>

              <div className="space-y-3">
                <Radio
                  name="gender"
                  checked={radioState === 'female'}
                  onChange={() => setRadioState('female')}
                  label="Female"
                  description="Expecting mother"
                />
                <Radio
                  name="gender"
                  checked={radioState === 'male'}
                  onChange={() => setRadioState('male')}
                  label="Male"
                  description="Partner / Supporter"
                />
              </div>
            </Card>

            {/* Slider & Segmented Tabs */}
            <Card rounded="3xl" className="space-y-5">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Slider & Segmented Control
              </span>

              <Slider
                label="Target PCV Percentage"
                showValue
                value={sliderVal}
                min={0}
                max={100}
                onChange={setSliderVal}
              />

              <div className="pt-3 border-t border-neutral-100">
                <span className="text-xs text-neutral-500 block mb-2">Segmented Control:</span>
                <SegmentedControl
                  fullWidth
                  value={tabVal}
                  onChange={setTabVal}
                  items={[
                    { value: 'upload', label: 'Upload Blood Count' },
                    { value: 'history', label: 'History' },
                  ]}
                />
              </div>
            </Card>
          </div>
        </section>

        {/* 6. Badges, Cards & Avatars */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-sans text-neutral-900">
              6. Badges, Avatars & Cards
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Matching leaderboard, profile, and stat card components.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Badges */}
            <Card rounded="3xl" className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Badge Variants
              </span>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="primary">2,450 points</Badge>
                <Badge variant="accent">340 points</Badge>
                <Badge variant="secondary">Rank #1</Badge>
                <Badge variant="success">Completed</Badge>
                <Badge variant="warning">Pending Review</Badge>
                <Badge variant="error">Failed Test</Badge>
                <Badge variant="neutral">Draft</Badge>
              </div>
            </Card>

            {/* Avatars */}
            <Card rounded="3xl" className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-primary block">
                Avatar Variants & Sizes
              </span>
              <div className="flex items-center gap-4">
                <Avatar name="Chioma Okafor" size="xl" showEditBadge />
                <Avatar name="Amina Yusuf" size="lg" variant="accent" />
                <Avatar name="Priya Sharma" size="md" variant="secondary" />
                <Avatar name="Ella Wilson" size="sm" variant="neutral" />
              </div>
            </Card>
          </div>
        </section>

        {/* Interactive Modal Preview */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Welcome Sarah!"
          description="Congratulations on taking the first step. Let's keep building your blood and safeguarding your journey."
        >
          <div className="flex flex-col items-center text-center space-y-4 pt-2">
            <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center text-primary text-3xl">
              🎉
            </div>
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setIsModalOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  )
}
