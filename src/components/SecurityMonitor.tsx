
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Trash2 } from 'lucide-react';

interface SecurityLog {
  timestamp: string;
  event: string;
  details: Record<string, any>;
}

export const SecurityMonitor = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadLogs = () => {
      const storedLogs = JSON.parse(localStorage.getItem('securityLogs') || '[]');
      setLogs(storedLogs.reverse()); // Show newest first
    };
    
    loadLogs();
    // Refresh logs every 10 seconds when visible
    const interval = isVisible ? setInterval(loadLogs, 10000) : null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVisible]);

  const clearLogs = () => {
    localStorage.removeItem('securityLogs');
    setLogs([]);
  };

  const getSeverityBadge = (event: string) => {
    if (event.includes('suspicious') || event.includes('rate_limit') || event.includes('invalid')) {
      return <Badge variant="destructive">High</Badge>;
    }
    if (event.includes('created') || event.includes('updated') || event.includes('deleted')) {
      return <Badge variant="default">Info</Badge>;
    }
    return <Badge variant="secondary">Low</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50"
      >
        <Shield className="w-4 h-4 mr-2" />
        Security Monitor
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="max-h-96 overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <CardTitle className="text-sm">Security Monitor</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={clearLogs}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            {logs.length} security events logged
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="max-h-80 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                No security events recorded
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {logs.slice(0, 20).map((log, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-3 py-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{log.event.replace(/_/g, ' ')}</span>
                      {getSeverityBadge(log.event)}
                    </div>
                    <div className="text-xs text-gray-500 mb-1">
                      {formatTimestamp(log.timestamp)}
                    </div>
                    {log.details.userId && (
                      <div className="text-xs text-blue-600">
                        User: {log.details.userId.slice(0, 8)}...
                      </div>
                    )}
                    {log.event.includes('suspicious') && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle className="w-3 h-3 text-red-500 mr-1" />
                        <span className="text-xs text-red-600">Security Alert</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
