
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Plus, ExternalLink } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TurkAkAccountService } from "@/services/turkak-account.service";
import { CertificateCustomerDto } from "@/types/api.types";
import { toast } from "sonner";

const RecentTurkAkCustomers = () => {
  const [entriesCount, setEntriesCount] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<CertificateCustomerDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCustomers, setFilteredCustomers] = useState<CertificateCustomerDto[]>([]);

  useEffect(() => {
    loadTurkAkCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filtered);
  }, [customers, searchTerm]);

  const loadTurkAkCustomers = async () => {
    try {
      const data = await TurkAkAccountService.getCertificateCustomers();
      setCustomers(data);
    } catch (error: any) {
      console.error('TürkAK customers loading error:', error);
      toast.error('TürkAK müşterileri yüklenirken hata oluştu', {
        description: error.message || 'Token geçersiz olabilir. TürkAK ayarlarını kontrol edin.',
      });
    } finally {
      setLoading(false);
    }
  };

  const displayedCustomers = filteredCustomers.slice(0, parseInt(entriesCount));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <h1 className="text-2xl font-bold">TürkAK Son Müşteriler</h1>
        </div>
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 border border-border rounded-lg">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold">TürkAK Son Müşteriler</h1>
          <p className="text-muted-foreground">TürkAK sistemindeki sertifika müşterileri</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            asChild
            variant="outline"
          >
            <Link to="/turkak-ayarlari">
              <ExternalLink className="mr-2 h-4 w-4" />
              TürkAK Ayarları
            </Link>
          </Button>
          
          <Button
            asChild
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <Link to="/musteri-ekle">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Müşteri Ekle
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select value={entriesCount} onValueChange={setEntriesCount}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span>Entries</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span>Search:</span>
          <Input 
            type="search" 
            placeholder="Müşteri adı ara..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-[250px]"
          />
        </div>
      </div>
      
      {displayedCustomers.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>ID:</strong> {customer.id}</p>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        Detayları Görüntüle
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <p>
              Toplam {filteredCustomers.length} müşteriden {displayedCustomers.length} tanesi gösteriliyor
            </p>
            <Button
              variant="outline"
              onClick={loadTurkAkCustomers}
              disabled={loading}
            >
              Yenile
            </Button>
          </div>
        </div>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center p-6 border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Arama kriterlerine uygun müşteri bulunamadı." : "TürkAK müşteri bulunamadı."}
          </p>
          {!searchTerm && (
            <div className="space-y-2 text-center">
              <p className="text-sm text-muted-foreground">
                TürkAK token'ınızın geçerli olduğundan emin olun.
              </p>
              <Button
                variant="outline"
                onClick={loadTurkAkCustomers}
                disabled={loading}
              >
                Tekrar Dene
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentTurkAkCustomers;
