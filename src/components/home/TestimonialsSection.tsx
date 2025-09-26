export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "I built around 500 hours as a time builder with Skyway Aviators, and as a First Officer at Republic Airways, I can confidently say I couldn't have achieved that without them. The aircraft availability was consistent, and the maintenance control was top-notch.",
      name: "Austin Liu",
      designation: "First Officer, Republic Airways",
      src: "/hero-image.png",
      rating: 5
    },
    {
      quote: "Great flight school project, fairly easy to get scheduled, especially so if you plan your flights several days out. I came here from New York to finish my 150 hours. Planes are kept in great shape and the on-site mechanics were quick to respond.",
      name: "Chriss Handlly",
      designation: "Flight Student",
      src: "/hero-image.png",
      rating: 5
    },
    {
      quote: "My son flew 100 hours in a month, but some days weather was bad, and sometimes the airplane was grounded. But the good thing is that they have their mechanic in the field and he took care of it immediately. Thank God for the staff.",
      name: "Frankie Arreguin",
      designation: "Parent",
      src: "/hero-image.png",
      rating: 5
    },
  ];

  return (
    <section id="careers" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Customer Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Real experiences from pilots, students, and aviation enthusiasts who trust Skyway Aviators
          </p>
        </div>

        {/* Simple Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Star Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-semibold text-sm">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
