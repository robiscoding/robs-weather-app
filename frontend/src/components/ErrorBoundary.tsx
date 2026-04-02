import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-sm text-center">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              An unexpected error occurred. Please reload the page to try again.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={() => window.location.reload()}>Reload</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}
