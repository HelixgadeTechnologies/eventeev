# Authentication Quick Reference Guide

## Using the Auth Hook

The `useAuth` hook provides all authentication functionality in your components.

### Import the Hook

```typescript
"use client";
import { useAuth } from "@/context/AuthContext";
```

### Available Properties and Methods

```typescript
const {
  user, // Current user object (null if not authenticated)
  session, // Current session object
  loading, // Boolean - true while checking auth state
  signUp, // Function to create new account
  signIn, // Function to sign in
  signOut, // Function to sign out
  resetPassword, // Function to send password reset email
  updatePassword, // Function to update password
} = useAuth();
```

## Common Use Cases

### 1. Sign Up Form

```typescript
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signUp(email, password, { full_name: fullName });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success! User will receive confirmation email
      router.push("/check-email");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
```

### 2. Sign In Form

```typescript
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // On success, user will be redirected to /events automatically
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
```

### 3. Sign Out Button

```typescript
"use client";
import { useAuth } from "@/context/AuthContext";

export default function SignOutButton() {
  const { signOut } = useAuth();

  return <button onClick={() => signOut()}>Sign Out</button>;
}
```

### 4. Forgot Password Form

```typescript
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <h2>Check your email</h2>
        <p>We've sent you a password reset link to {email}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
```

### 5. Reset Password Form

```typescript
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/events");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New Password"
        required
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
```

### 6. Protected Component (Show content only to authenticated users)

```typescript
"use client";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view this content</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.email}!</h1>
      {/* Protected content here */}
    </div>
  );
}
```

### 7. Display User Info

```typescript
"use client";
import { useAuth } from "@/context/AuthContext";

export default function UserProfile() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not signed in</div>;

  return (
    <div>
      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
      <p>Full Name: {user.user_metadata?.full_name}</p>
      <p>Phone: {user.user_metadata?.phone_number}</p>
    </div>
  );
}
```

### 8. Conditional Rendering Based on Auth State

```typescript
"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Navigation() {
  const { user, signOut } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <Link href="/events">Events</Link>
          <Link href="/profile">Profile</Link>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
```

## Using Auth Service Directly

For more advanced use cases, you can use the `authService` directly:

```typescript
import { authService } from "@/lib/services/auth.service";

// Sign in with OAuth
const { data, error } = await authService.signInWithOAuth("google");

// Get current user
const { user, error } = await authService.getCurrentUser();

// Update profile
const { data, error } = await authService.updateProfile(userId, {
  full_name: "John Doe",
  phone_number: "+1234567890",
});
```

## Error Handling

Common error messages:

- `Invalid login credentials` - Wrong email or password
- `Email not confirmed` - User hasn't verified their email
- `User already registered` - Email already exists
- `Password should be at least 6 characters` - Password too short

## Best Practices

1. **Always handle errors**: Display user-friendly error messages
2. **Show loading states**: Disable buttons and show loading indicators
3. **Validate input**: Check email format and password strength
4. **Clear sensitive data**: Clear password fields after submission
5. **Use loading state**: Prevent multiple submissions
6. **Redirect after auth**: Navigate users to appropriate pages

## TypeScript Types

```typescript
import { User, Session, AuthError } from "@supabase/supabase-js";

// User type
const user: User | null;

// Session type
const session: Session | null;

// Error type
const error: AuthError | null;
```
