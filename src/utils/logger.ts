import { supabase } from '../lib/supabase';

type LogLevel = 'info' | 'warn' | 'error';
type LogContext = Record<string, any>;

class Logger {
  private static instance: Logger;
  private debugMode: boolean = import.meta.env.DEV;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  async log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level,
      message,
      context: context ? JSON.stringify(context) : undefined,
      timestamp,
      environment: import.meta.env.MODE,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Always console log in development
    if (this.debugMode) {
      console[level](message, context || '');
      if (context?.error instanceof Error) {
        console[level]('Error stack:', context.error.stack);
      }
    }

    // Store critical errors in Supabase for production monitoring
    if (level === 'error') {
      try {
        const { error } = await supabase
          .from('error_logs')
          .insert([logEntry]);
          
        if (error) {
          console.error('Failed to store error log:', error);
        }
      } catch (err) {
        console.error('Failed to store error log:', err);
      }
    }

    return logEntry;
  }

  info(message: string, context?: LogContext) {
    return this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    return this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    return this.log('error', message, context);
  }
}

export const logger = Logger.getInstance();