# Install dependencies only when needed
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app

# Add non root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_PUBLIC_SUPABASE_URL=https://jcwvxkqbfqxvzfhsxvxz.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd3Z4a3FiZnF4dnpmaHN4dnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzM0NzUsImV4cCI6MjAyNTI0OTQ3NX0.0LxLCBYBGPXiEkgMSGTVvvRmXxEpGBFPfkVhWXCKPFE
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbnB1cnR6YnN0Z3d4b254bGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyMTYwOCwiZXhwIjoyMDQ4Njk3NjA4fQ.uLnHVU3p44DH1nsYkyIff5I0xOHJZ0OZTatXayCKKO0
ENV STRIPE_SECRET_API_KEY=sk_test_51OmyFrDxIHbKvxKDRLEZUfCHXNPFcbfnEFhkVgBPLHxLuqTWNQDYbvqxKpRdIvQgDZBZHbsJgBzYKYBVbXHWCYXg00eLBRKjQS
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY=pk_test_51OmyFrDxIHbKvxKDwVnvLnJjYAcYDNcNLdUKYZNEFsWQGmCFHHFSvlHlBMFbcPwvYlLEOxqwUxhkUJcQbFSPGFzY00Pu4KPGxD
ENV STRIPE_WEBHOOK_SECRET=whsec_6f3c1c1b1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_PUBLIC_SUPABASE_URL=https://jcwvxkqbfqxvzfhsxvxz.supabase.co
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd3Z4a3FiZnF4dnpmaHN4dnh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2NzM0NzUsImV4cCI6MjAyNTI0OTQ3NX0.0LxLCBYBGPXiEkgMSGTVvvRmXxEpGBFPfkVhWXCKPFE
ENV SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnbnB1cnR6YnN0Z3d4b254bGhmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzEyMTYwOCwiZXhwIjoyMDQ4Njk3NjA4fQ.uLnHVU3p44DH1nsYkyIff5I0xOHJZ0OZTatXayCKKO0
ENV STRIPE_SECRET_API_KEY=sk_test_51OmyFrDxIHbKvxKDRLEZUfCHXNPFcbfnEFhkVgBPLHxLuqTWNQDYbvqxKpRdIvQgDZBZHbsJgBzYKYBVbXHWCYXg00eLBRKjQS
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY=pk_test_51OmyFrDxIHbKvxKDwVnvLnJjYAcYDNcNLdUKYZNEFsWQGmCFHHFSvlHlBMFbcPwvYlLEOxqwUxhkUJcQbFSPGFzY00Pu4KPGxD
ENV STRIPE_WEBHOOK_SECRET=whsec_6f3c1c1b1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]