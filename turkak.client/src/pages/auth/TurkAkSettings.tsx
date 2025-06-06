
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { TurkAkAccountService } from "@/services/turkak-account.service";

const TurkAkSettings = () => {
  const [credentials, setCredentials] = useState({
    turkakAccUserName: "",
    turkakAccPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<{
    valid: boolean;
    expiresInMinutes: number;
  } | null>(null);

  useEffect(() => {
    checkTokenStatus();
  }, []);

  const checkTokenStatus = async () => {
    try {
      const status = await TurkAkAccountService.getTokenStatus();
      setTokenStatus(status);
    } catch (error) {
      console.error("Token status check error:", error);
      setTokenStatus({ valid: false, expiresInMinutes: 0 });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await TurkAkAccountService.login(credentials);
      
      if (result.status === "success") {
        toast.success("TürkAK giriş başarılı!", {
          description: result.message,
        });
        
        // Clear form and refresh token status
        setCredentials({
          turkakAccUserName: "",
          turkakAccPassword: "",
        });
        
        await checkTokenStatus();
      } else {
        toast.error("TürkAK giriş başarısız", {
          description: result.message,
        });
      }
    } catch (error: any) {
      toast.error("TürkAK giriş hatası", {
        description: error.message || "Beklenmeyen bir hata oluştu",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await TurkAkAccountService.logout();
      toast.success("TürkAK çıkış başarılı", {
        description: result.message,
      });
      await checkTokenStatus();
    } catch (error: any) {
      toast.error("Çıkış hatası", {
        description: error.message || "Beklenmeyen bir hata oluştu",
      });
    }
  };

  const handleClearExpiredToken = async () => {
    try {
      const result = await TurkAkAccountService.clearExpiredToken();
      toast.info("Token temizleme", {
        description: result.message,
      });
      await checkTokenStatus();
    } catch (error: any) {
      toast.error("Token temizleme hatası", {
        description: error.message || "Beklenmeyen bir hata oluştu",
      });
    }
  };

  const getStatusColor = () => {
    if (!tokenStatus || !tokenStatus.valid) return "text-red-500";
    if (tokenStatus.expiresInMinutes <= 60) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusIcon = () => {
    if (!tokenStatus || !tokenStatus.valid) return <AlertCircle className="h-5 w-5 text-red-500" />;
    if (tokenStatus.expiresInMinutes <= 60) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  };

  const formatTimeRemaining = (minutes: number) => {
    if (minutes <= 0) return "Süresi dolmuş";
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    
    if (hours > 0) {
      return `${hours} saat ${remainingMinutes} dakika`;
    }
    return `${remainingMinutes} dakika`;
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">TürkAK Ayarları</h1>
        <p className="text-muted-foreground mt-1">
          TürkAK hesabınızla oturum açın ve API token'ınızı yönetin.
        </p>
      </div>

      <div className="space-y-6">
        {/* Token Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Token Durumu
            </CardTitle>
            <CardDescription>
              Mevcut TürkAK API token durumunuz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Durum:</span>
                <span className={`font-semibold ${getStatusColor()}`}>
                  {tokenStatus?.valid ? "Geçerli" : "Geçersiz"}
                </span>
              </div>
              
              {tokenStatus?.valid && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Kalan Süre:</span>
                  <span className={`font-semibold ${getStatusColor()}`}>
                    {formatTimeRemaining(tokenStatus.expiresInMinutes)}
                  </span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkTokenStatus}
                >
                  Durumu Yenile
                </Button>
                
                {tokenStatus?.valid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                  >
                    Çıkış Yap
                  </Button>
                )}
                
                {!tokenStatus?.valid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearExpiredToken}
                  >
                    Süresi Dolmuş Token'ı Temizle
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Login Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>TürkAK Oturum Açma</CardTitle>
            <CardDescription>
              TürkAK hesap bilgilerinizi girerek API token alın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  type="text"
                  value={credentials.turkakAccUserName}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    turkakAccUserName: e.target.value
                  }))}
                  placeholder="TürkAK kullanıcı adınız"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.turkakAccPassword}
                  onChange={(e) => setCredentials(prev => ({
                    ...prev,
                    turkakAccPassword: e.target.value
                  }))}
                  placeholder="TürkAK şifreniz"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Giriş yapılıyor..." : "TürkAK'a Giriş Yap"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bilgilendirme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Token süresi 12 saattir.</p>
              <p>• Token süresi dolmadan önce yeniden giriş yapabilirsiniz.</p>
              <p>• API işlemleri için geçerli bir token gereklidir.</p>
              <p>• Güvenlik nedeniyle şifreler saklanmaz.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TurkAkSettings;
