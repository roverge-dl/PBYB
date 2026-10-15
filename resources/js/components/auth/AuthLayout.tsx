import React from "react";
import { cn } from "../../lib/utils";

export interface AuthLayoutProps {
  title?: string;
  subtitle?: string;
  topBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  title,
  subtitle,
  topBadge,
  heroTitle = "Create Your Account",
  heroSubtitle = "Let's build you a healthy blood and safeguard your maternal health together.",
  children,
  className,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#FDFBFD] flex flex-col justify-center p-4 mobilemd:p-4 tabletlg:p-6 xl:p-8 font-sans selection:bg-primary-500 selection:text-white">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 tabletlg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-2rem)] mobilemd:min-h-[calc(100vh-3rem)]">
        {/* Left Column: Visual Hero Card (Desktop & Tablet-LG) */}
        <div className="hidden tabletlg:flex tabletlg:col-span-6 xl:col-span-6 relative h-full min-h-[640px] max-h-[880px] w-full rounded-lg overflow-hidden shadow-card">
          <img
            src="/images/hero-mother.png"
            alt="PBYB Mother and Child"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />

          {/* Subtle brand tint overlay with bottom dark gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

          {/* Bottom Card Content matching Figma dashboard.jpg */}
          <div className="relative mt-auto p-8 xl:p-10 text-white z-10 space-y-2">
            <h2 className="font-display text-3xl xl:text-4xl capitalize  tracking-wide drop-shadow-sm">
              {heroTitle}
            </h2>
            <p className="font-sans text-sm xl:text-base text-white/85 max-w-md font-normal leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>

        {/* Right Column: Form Container (Mobile & Desktop) */}
        <div className="tabletlg:col-span-6 xl:col-span-6 flex flex-col justify-center items-center w-full py-4 mobilemd:py-8 px-2 mobilemd:px-6">
          <div className={cn("w-full max-w-[440px] mx-auto", className)}>
            {/* Mobile Top Brand Logo (Shown on mobile screens < tabletlg) */}
            <div className="tabletlg:hidden flex flex-col items-center mb-6">
              <img
                src="/images/birthsafe-logo.png"
                alt="BirthSafe Logo"
                className="w-20 h-20 object-contain drop-shadow-subtle"
              />
            </div>

            {/* Header Content */}
            <div className="mb-6 space-y-1.5">
              {topBadge && (
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {topBadge}
                </span>
              )}
              <h1 className="mobilemd:text-2xl text-xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-sans">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-neutral-500 font-normal leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>

            {/* Form & Actions Slot */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
