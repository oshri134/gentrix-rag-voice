import VoiceChat from "@/components/VoiceChat";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Home() {
  return (
    <ErrorBoundary>
      <VoiceChat />
    </ErrorBoundary>
  );
}
