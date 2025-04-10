
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO, isAfter, isBefore, isToday } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, PlusCircle, CheckCircle, XCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  Appointment
} from '@/services/appointmentService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  doctor_name: z.string().min(2, "Doctor name is required"),
  doctor_specialty: z.string().optional(),
  hospital_name: z.string().optional(),
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string().min(1, "Appointment time is required"),
  notes: z.string().optional(),
});

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor_name: "",
      doctor_specialty: "",
      hospital_name: "",
      time: "09:00",
      notes: "",
    },
  });

  const loadAppointments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await fetchAppointments(user.id);
      if (data) {
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    try {
      const appointmentDate = new Date(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        parseInt(values.time.split(':')[0]),
        parseInt(values.time.split(':')[1])
      ).toISOString();

      const newAppointment = await createAppointment(user.id, {
        doctor_name: values.doctor_name,
        doctor_specialty: values.doctor_specialty || null,
        hospital_name: values.hospital_name || null,
        datetime: appointmentDate,
        notes: values.notes || null,
        status: 'scheduled'
      });
      
      if (newAppointment) {
        setAppointments([...appointments, newAppointment]);
        toast({
          title: "Success",
          description: "Appointment scheduled successfully",
        });
        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateAppointment(id, { status });
      setAppointments(appointments.map(appt => 
        appt.id === id ? { ...appt, status } : appt
      ));
      toast({
        title: "Success",
        description: `Appointment marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(appt => appt.id !== id));
      toast({
        title: "Success",
        description: "Appointment deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: "Failed to delete appointment",
        variant: "destructive",
      });
    }
  };

  const upcomingAppointments = appointments.filter(appt => 
    isAfter(new Date(appt.datetime), new Date()) || isToday(new Date(appt.datetime))
  );
  
  const pastAppointments = appointments.filter(appt => 
    isBefore(new Date(appt.datetime), new Date()) && !isToday(new Date(appt.datetime))
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground mt-1">
              Schedule and manage your medical appointments
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Schedule Appointment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Appointment</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="doctor_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="doctor_specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cardiologist" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hospital_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospital/Clinic (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Memorial Hospital" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date</FormLabel>
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
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
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
                    Schedule Appointment
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 pt-4">
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
            ) : upcomingAppointments.length === 0 ? (
              <Card className="glass-morphism">
                <CardContent className="p-6 text-center">
                  <div className="py-12">
                    <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium">No upcoming appointments</h3>
                    <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                      Schedule your first appointment to start tracking them
                    </p>
                    <DialogTrigger asChild>
                      <Button className="mt-6">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Schedule Your First Appointment
                      </Button>
                    </DialogTrigger>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <Card key={appointment.id} className="glass-morphism overflow-hidden">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 md:grid-cols-4">
                        <div className="bg-white/5 p-6 flex flex-col justify-center items-center md:border-r border-white/10">
                          <div className="text-center">
                            <p className="text-2xl font-bold">
                              {format(parseISO(appointment.datetime), 'dd')}
                            </p>
                            <p className="text-lg">
                              {format(parseISO(appointment.datetime), 'MMM')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {format(parseISO(appointment.datetime), 'hh:mm a')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="p-6 md:col-span-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-health-blue" />
                              <h3 className="font-semibold">{appointment.doctor_name}</h3>
                              {appointment.doctor_specialty && (
                                <span className="text-sm text-muted-foreground">{appointment.doctor_specialty}</span>
                              )}
                            </div>
                            
                            {appointment.hospital_name && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{appointment.hospital_name}</span>
                              </div>
                            )}
                            
                            {appointment.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col gap-2 justify-center items-center md:border-l border-white/10">
                          <div className="flex flex-col gap-2 w-full">
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                              className="w-full"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                              className="w-full"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {pastAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No past appointments</h3>
                    <p className="text-muted-foreground mt-2">
                      Your appointment history will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="flex items-center gap-4 p-4 border-b border-white/10 last:border-0"
                      >
                        <div className="flex-shrink-0 text-center">
                          <p className="text-lg font-bold">
                            {format(parseISO(appointment.datetime), 'dd')}
                          </p>
                          <p className="text-sm">
                            {format(parseISO(appointment.datetime), 'MMM')}
                          </p>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{appointment.doctor_name}</h4>
                            {appointment.doctor_specialty && (
                              <span className="text-sm text-muted-foreground">({appointment.doctor_specialty})</span>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {format(parseISO(appointment.datetime), 'h:mm a')}
                              </span>
                            </div>
                            
                            {appointment.hospital_name && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{appointment.hospital_name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-shrink-0">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            appointment.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : appointment.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-blue-500/20 text-blue-500'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Appointments;
