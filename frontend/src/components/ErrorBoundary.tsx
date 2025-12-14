import React from 'react';

export default class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props:any){ super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error:any) { console.error('Render error:', error); }
  render() { return this.state.hasError ? <div style={{padding:20}}>Something went wrong. Check console.</div> : this.props.children; }
}