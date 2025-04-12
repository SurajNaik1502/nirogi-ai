import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO, addHours, setHours, setMinutes } from 'date-fns';
import { 
  Clock, 
  Calendar as CalendarIcon, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ClipboardList,
  Building2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  Appointment
} from '@/services/appointmentService';
import { fetchHospitals, Hospital } from '@/services/hospitalService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  doctor_name: z.string().min(2, "Doctor name is required"),
  doctor_specialty: z.string().optional(),
  hospital_name: z.string().optional(),
  datetime: z.date({
    required_error: "Appointment date and time is required",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  notes: z.string().optional(),
});

const Appointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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
        setAppointments(data as Appointment[]);
      }

      const hospitalsData = await fetchHospitals();
      if (hospitalsData) {
        setHospitals(hospitalsData as Hospital[]);
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
      // Combine date and time
      const [hours, minutes] = values.time.split(':').map(Number);
      const datetime = new Date(values.datetime);
      const combinedDatetime = setMinutes(setHours(datetime, hours), minutes);
      
      const newAppointment = await createAppointment(user.id, {
        doctor_name: values.doctor_name,
        doctor_specialty: values.doctor_specialty || null,
        hospital_name: values.hospital_name || null,
        datetime: combinedDatetime.toISOString(),
        notes: values.notes || null,
        status: 'scheduled'
      });
      
      if (newAppointment) {
        setAppointments([...(appointments || []), newAppointment as Appointment]);
        toast({
          title: "Success",
          description: "Appointment scheduled successfully",
        });
        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const updatedAppointment = await updateAppointment(id, { status });
      if (updatedAppointment) {
        setAppointments(appointments.map(apt => 
          apt.id === id ? { ...apt, status } as Appointment : apt
        ));
        
        if (selectedAppointment?.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status } as Appointment);
        }
        
        toast({
          title: "Success",
          description: `Appointment ${status === 'completed' ? 'marked as completed' : status === 'cancelled' ? 'cancelled' : 'updated'}`,
        });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter(apt => apt.id !== id));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">{status}</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">{status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === 'scheduled' && new Date(appointment.datetime) >= new Date()
  );
  
  const pastAppointments = appointments.filter(appointment => 
    appointment.status === 'completed' || appointment.status === 'cancelled' || 
    (appointment.status === 'scheduled' && new Date(appointment.datetime) < new Date())
  );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

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
                New Appointment
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
                          <Input placeholder="Dr. John Smith" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cardiology">Cardiology</SelectItem>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                            <SelectItem value="orthopedics">Orthopedics</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="psychiatry">Psychiatry</SelectItem>
                            <SelectItem value="general">General Practice</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select hospital" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {hospitals.map(hospital => (
                              <SelectItem key={hospital.id} value={hospital.hospital_name}>
                                {hospital.hospital_name}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="datetime"
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
                                className="p-3 pointer-events-auto"
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
                            placeholder="Any special instructions or reason for visit"
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
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
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
                        <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <h3 className="text-xl font-medium">No upcoming appointments</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                          You don't have any upcoming appointments scheduled
                        </p>
                        <Button className="mt-6" onClick={() => setDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Schedule Your First Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  upcomingAppointments.map(appointment => (
                    <Card 
                      key={appointment.id} 
                      className={`glass-morphism hover:bg-white/5 transition-colors cursor-pointer ${
                        selectedAppointment?.id === appointment.id ? 'bg-white/5' : ''
                      }`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{appointment.doctor_name}</h3>
                            <div className="text-sm text-muted-foreground mt-1">
                              {appointment.doctor_specialty && (
                                <p>{appointment.doctor_specialty}</p>
                              )}
                              {appointment.hospital_name && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Building2 className="h-3 w-3" />
                                  <span>{appointment.hospital_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="mt-4 space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{format(parseISO(appointment.datetime), 'EEEE, MMMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{format(parseISO(appointment.datetime), 'h:mm a')}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              <div className="md:col-span-2">
                {selectedAppointment ? (
                  <Card className="glass-morphism">
                    <CardHeader>
                      <CardTitle>Appointment Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-2xl font-bold">{selectedAppointment.doctor_name}</h2>
                            {selectedAppointment.doctor_specialty && (
                              <p className="text-muted-foreground">{selectedAppointment.doctor_specialty}</p>
                            )}
                          </div>
                          {getStatusBadge(selectedAppointment.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm text-muted-foreground">Date & Time</h3>
                            <p className="font-medium">
                              {format(parseISO(selectedAppointment.datetime), 'EEEE, MMMM d, yyyy')}
                              <br />
                              {format(parseISO(selectedAppointment.datetime), 'h:mm a')}
                            </p>
                          </div>
                          
                          {selectedAppointment.hospital_name && (
                            <div>
                              <h3 className="text-sm text-muted-foreground">Location</h3>
                              <p className="font-medium">{selectedAppointment.hospital_name}</p>
                            </div>
                          )}
                        </div>
                        
                        {selectedAppointment.notes && (
                          <div>
                            <h3 className="text-sm text-muted-foreground">Notes</h3>
                            <p className="mt-1">{selectedAppointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="border-t border-white/10 pt-4">
                          <h3 className="font-medium mb-2">Appointment Actions</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedAppointment.status === 'scheduled' && (
                              <>
                                <Button 
                                  variant="default" 
                                  onClick={() => updateAppointmentStatus(selectedAppointment.id, 'completed')}
                                >
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Mark as Completed
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="text-red-500 hover:text-red-600"
                                  onClick={() => updateAppointmentStatus(selectedAppointment.id, 'cancelled')}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Cancel Appointment
                                </Button>
                              </>
                            )}
                            <Button 
                              variant="ghost" 
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-morphism h-full">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <ClipboardList className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-medium">No appointment selected</h3>
                      <p className="text-muted-foreground mt-2 max-w-md">
                        Select an appointment from the list to view details or click the button to schedule a new one
                      </p>
                      <Button className="mt-6" onClick={() => setDialogOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Appointment
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="past" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Past Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : pastAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No past appointments</h3>
                    <p className="text-muted-foreground mt-2">Your appointment history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="flex justify-between items-center p-4 border-b border-white/10 last:border-0"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{appointment.doctor_name}</h4>
                            {getStatusBadge(appointment.status)}
                          </div>
                          
                          <div className="text-sm text-muted-foreground mt-1">
                            {appointment.doctor_specialty && (
                              <span>{appointment.doctor_specialty} • </span>
                            )}
                            {format(parseISO(appointment.datetime), 'MMMM d, yyyy')} at {format(parseISO(appointment.datetime), 'h:mm a')}
                          </div>
                          
                          {appointment.hospital_name && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <Building2 className="h-3 w-3" />
                              <span>{appointment.hospital_name}</span>
                            </div>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="pt-4">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-48">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">No appointments found</h3>
                    <p className="text-muted-foreground mt-2">Schedule your first appointment to get started</p>
                    <Button className="mt-4" onClick={() => setDialogOpen(true)}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments
                      .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())
                      .map(appointment => (
                        <div 
                          key={appointment.id}
                          className="flex justify-between items-center p-4 border-b border-white/10 last:border-0"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{appointment.doctor_name}</h4>
                              {getStatusBadge(appointment.status)}
                            </div>
                            
                            <div className="text-sm text-muted-foreground mt-1">
                              {appointment.doctor_specialty && (
                                <span>{appointment.doctor_specialty} • </span>
                              )}
                              {format(parseISO(appointment.datetime), 'MMMM d, yyyy')} at {format(parseISO(appointment.datetime), 'h:mm a')}
                            </div>
                            
                            {appointment.hospital_name && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Building2 className="h-3 w-3" />
                                <span>{appointment.hospital_name}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {appointment.status === 'scheduled' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-500"
                                onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground"
                              onClick={() => handleDeleteAppointment(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
