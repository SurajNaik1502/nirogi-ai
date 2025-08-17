
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parseISO, isToday } from 'date-fns';
import { Pill, Clock, Calendar as CalendarIcon, CheckCircle, PlusCircle, Trash2, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchMedications, 
  createMedication, 
  logMedicationTaken, 
  deleteMedication,
  Medication
} from '@/services/medicationService';
import { notificationService, CustomNotificationData } from '@/services/notificationService';
import { CustomNotificationDialog } from '@/components/medication/CustomNotificationDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, "Medication name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date().optional(),
  notes: z.string().optional(),
});

const MedicineTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pendingAsNeededMedication, setPendingAsNeededMedication] = useState<Medication | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "daily",
      notes: "",
    },
  });

  const loadMedications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchMedications(user.id);
      if (data) {
        setMedications(data as Medication[]);
      }
    } catch (error) {
      console.error('Error loading medications:', error);
      toast({
        title: "Error",
        description: "Failed to load medications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedications();
    initializeNotifications();
  }, [user]);

  const initializeNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    setNotificationsEnabled(hasPermission);
    
    if (hasPermission) {
      notificationService.loadNotificationsFromStorage();
    }
  };

  const setupNotificationForMedication = (medication: Medication, customData?: CustomNotificationData) => {
    if (notificationsEnabled) {
      notificationService.setupMedicationNotifications(medication, customData);
      toast({
        title: "Notifications Set",
        description: `Reminders scheduled for ${medication.name}`,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      const newMedication = await createMedication(user.id, {
        name: values.name,
        dosage: values.dosage,
        frequency: values.frequency,
        start_date: values.start_date.toISOString().split('T')[0],
        end_date: values.end_date ? values.end_date.toISOString().split('T')[0] : null,
        notes: values.notes
      });
      
      if (newMedication) {
        const medication = newMedication as Medication;
        setMedications([medication, ...medications]);
        
        // Handle notifications based on frequency
        if (medication.frequency === 'as-needed') {
          setPendingAsNeededMedication(medication);
        } else {
          setupNotificationForMedication(medication);
        }
        
        toast({
          title: "Success",
          description: "Medication added successfully",
        });
        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication",
        variant: "destructive",
      });
    }
  };

  const handleLogMedication = async (medication: Medication) => {
    try {
      await logMedicationTaken(medication.id, new Date().toISOString());
      toast({
        title: "Success",
        description: `${medication.name} marked as taken`,
      });
      loadMedications();
    } catch (error) {
      console.error('Error logging medication:', error);
      toast({
        title: "Error",
        description: "Failed to log medication",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      await deleteMedication(id);
      notificationService.clearNotifications(id);
      setMedications(medications.filter(med => med.id !== id));
      toast({
        title: "Success",
        description: "Medication deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast({
        title: "Error",
        description: "Failed to delete medication",
        variant: "destructive",
      });
    }
  };

  const handleCustomNotificationSave = (data: CustomNotificationData) => {
    if (pendingAsNeededMedication) {
      setupNotificationForMedication(pendingAsNeededMedication, data);
      setPendingAsNeededMedication(null);
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const hasPermission = await notificationService.requestPermission();
      if (hasPermission) {
        setNotificationsEnabled(true);
        // Re-setup notifications for all medications
        medications.forEach(med => {
          if (med.frequency !== 'as-needed') {
            setupNotificationForMedication(med);
          }
        });
      }
    } else {
      setNotificationsEnabled(false);
      // Clear all notifications
      medications.forEach(med => {
        notificationService.clearNotifications(med.id);
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Medicine Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your medications with smart reminders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={toggleNotifications}
              className="flex items-center gap-2"
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="h-4 w-4" />
                  Notifications On
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4" />
                  Enable Notifications
                </>
              )}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Medication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Medication</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medication Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Aspirin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 100mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="twice-daily">Twice daily</SelectItem>
                              <SelectItem value="every-other-day">Every other day</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="as-needed">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {form.watch('frequency') === 'as-needed' && (
                            <p className="text-xs text-muted-foreground">
                              You'll be able to set custom notification times after adding the medication.
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>End Date (Optional)</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className="w-full pl-3 text-left font-normal"
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value || undefined}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any additional information"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Add Medication
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Medications</TabsTrigger>
            <TabsTrigger value="all">All Medications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4 pt-4">
            {notificationsEnabled && (
              <Card className="glass-morphism border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-primary" />
                    <span className="font-medium">Smart Notifications Enabled</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    • Twice daily: 1:00 PM & 9:00 PM • Daily: 8:00 PM • Weekly: Mondays at 8:00 PM
                  </p>
                </CardContent>
              </Card>
            )}
            {loading ? (
              <Card className="glass-morphism">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center h-48">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : medications.length === 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-6 text-center">
                  <div className="py-12">
                    <Pill className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No medications found</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Add your medications to start tracking them
                    </p>
                    <Button className="mt-6" onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Medication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medications.map(medication => (
                  <Card key={medication.id} className="glass-morphism hover:bg-white/5 transition-colors overflow-hidden">
                    <CardHeader className="bg-white/5 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-health-purple/20 flex items-center justify-center">
                            <Pill className="h-5 w-5 text-health-purple" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{medication.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteMedication(medication.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Frequency: {medication.frequency}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>Started: {format(parseISO(medication.start_date), 'MMM d, yyyy')}</span>
                        </div>
                        {medication.end_date && (
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Ends: {format(parseISO(medication.end_date), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                        {medication.notes && (
                          <p className="text-sm mt-2 text-muted-foreground">{medication.notes}</p>
                        )}
                        
                        {/* Notification Status */}
                        <div className="flex items-center gap-2 text-xs mt-2">
                          {notificationsEnabled && notificationService.getNotificationSettings(medication.id) ? (
                            <>
                              <Bell className="h-3 w-3 text-green-500" />
                              <span className="text-green-500">Notifications active</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">No notifications</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Button
                          className="w-full"
                          variant="default"
                          onClick={() => handleLogMedication(medication)}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Taken
                        </Button>
                        
                        {medication.frequency === 'as-needed' && (
                          <CustomNotificationDialog
                            onSave={handleCustomNotificationSave}
                            trigger={
                              <Button variant="outline" className="w-full">
                                <Clock className="mr-2 h-4 w-4" />
                                Set Reminder
                              </Button>
                            }
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="pt-4">
            <Card className="glass-morphism">
              <CardContent className="pt-6">
                {medications.length === 0 ? (
                  <div className="text-center py-12">
                    <Pill className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No medication history</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Your medication history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Medication list */}
                    {medications.map(medication => (
                      <div 
                        key={medication.id}
                        className="flex justify-between items-center p-4 border-b border-white/10 last:border-0"
                      >
                        <div>
                          <h4 className="font-medium">{medication.name}</h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-muted-foreground">{medication.dosage}</span>
                            <span className="text-sm text-muted-foreground">
                              {format(parseISO(medication.start_date), 'MMM d, yyyy')}
                              {medication.end_date && ` - ${format(parseISO(medication.end_date), 'MMM d, yyyy')}`}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLogMedication(medication)}
                        >
                          Log Dose
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Custom Notification Dialog for As-Needed Medications */}
        {pendingAsNeededMedication && (
          <CustomNotificationDialog
            onSave={handleCustomNotificationSave}
            trigger={<div style={{ display: 'none' }} />}
          />
        )}
      </div>
    </Layout>
  );
};

export default MedicineTracker;
