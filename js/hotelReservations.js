$(document).ready(function(){
	var starsRatingArray = [];
	$('#errorContainer').hide();
	$('#listHotels').click(function(){
		$.ajax({
			type: 'GET',
			url: 'http://fake-hotel-api.herokuapp.com/api/hotels?count=5'
		}).done(function(data, textStatus, errorThrown){
			$('#errorContainer').hide();
			var allHotelsHtml = '';
			allHotelsHtml += '<section class="col-xs-12 col-sm-6 col-md-12">';
			for(var key in data){
				var value = data[key];
				starsRatingArray.push(value.stars);
				var startingDate, endingDate, startDatePieces, reversedStartDate, reversedEndDate, renderCorrectStartDate, renderCorrectEndDate;
				startingDate = value.date_start.split('T')[0];
				startDatePieces = startingDate.split('-');
				startDatePieces.reverse();
				//reversing date to fit german time format
				endingDate = value.date_end.split('T')[0];
				endDatePieces = endingDate.split('-');
				endDatePieces.reverse();
				//join reversed dates and add dots
				reversedStartDate = startDatePieces.join('.');
				reversedEndDate = endDatePieces.join('.');
				//render hotels
				allHotelsHtml += '<div class="container fitImagesIntoContainer">';
				allHotelsHtml += '<div class="search-result row">';
				allHotelsHtml += '<div class="col-md-4 addPadding"><ul class="bxslider">';
				for(var cnt=0; imagesLngth = value.images[cnt]; cnt++){
					allHotelsHtml += '<li><img src="' + imagesLngth + '"></li>';
				}
				allHotelsHtml += '</ul></div>';
				allHotelsHtml += '<div class="col-md-8 addGrayColor"><div class="col-md-12 row"><div class="col-md-9"><strong>' + value.name.replace(/\b\w/g, function(l){ return l.toUpperCase() }) + '</strong></div><div class="col-md-3 fitContentRight"><span class="star-icon rating_' + key + '">☆</span><span class="star-icon rating_' + key + '">☆</span><span class="star-icon rating_' + key + '">☆</span><span class="star-icon rating_' + key + '">☆</span><span class="star-icon rating_' + key + '">☆</span></div></div>';
				allHotelsHtml += '<div class="col-md-9"><span>' + value.city + ' - ' + value.country + '</span></div><br>';
				allHotelsHtml += '<div class="col-md-12"><span>' + value.description + '</span></div>';
				allHotelsHtml += '<div class="col-md-12 row"><div class="col-md-12 fitContentRight"><p>' + reversedStartDate + ' - ' + reversedEndDate + '</p></div></div>';
				allHotelsHtml += '<div class="col-md-12 row"><div class="col-md-8"><input type="checkbox" class="invisible"><button data-toggle="collapse" data-target=".reviewsContainer_' + key + '" class="btn customButtons loadSpecificReview buttonNo_' + key + '" id="' + value.id + '">Show Reviews</button></div><div class="col-md-4 fitContentRight"><p><strong>' + value.price + ' &#8364;</strong></p></div></div>';
				allHotelsHtml += '</div>';
				allHotelsHtml += '</div>';
				allHotelsHtml += '</div>';
				allHotelsHtml += '<div class="container collapsibleMenu reviewsContainer reviewsContainer_' + key + ' collapse"></div><br>';
			}
			allHotelsHtml += '</section>';
			$('#renderAllHotelsContainer').html(allHotelsHtml);
			callBxSliderLibrary();
			showUserReviews();
			fillStars();
		}).fail(function(jqXHR, textStatus, errorThrown) {
			$('#renderAllHotelsContainer').html('');
			$('#errorContainer').html(jqXHR.responseJSON.error).removeClass('invisible');
			$('#errorContainer').show();
		});
		//Show Reviews Button function
		function showUserReviews(){
			$('.loadSpecificReview').click(function(){
				var $this = $(this);
				var chosenHotelID = $this.prop('id'),
					takeButtonNumber = $this.prop('class').split('_')[1];
				if ($this.parent().children(':first-child').is(':checked')){
					$this.parent().children(':first-child').prop('checked', false);
					$this.text('Show Reviews');
				}
				else{
					$this.parent().children(':first-child').prop('checked', true);
					$this.text('Hide Reviews');
					$.ajax({
						type: 'GET',
						url: 'http://fake-hotel-api.herokuapp.com/api/reviews?hotel_id=/' + chosenHotelID
					}).done(function(data, textStatus, errorThrown){
						var dataLength = data.length;
						if (dataLength != 0){
							var renderReview = '';
							for(var key in data){
								var value = data[key];
								var commentType, hrElementHtml;
								(value.positive) ? commentType = '+' : commentType = '-';
								renderReview += '<div class="row marginFromHotelContainer"><div class="col-md-1"><div class="circles">' + commentType + '</div></div><div class="col-md-11"><strong>' + value.name + '</strong><br>' + value.comment + '</div></div><br><hr>';
							}
							$('.reviewsContainer_' + takeButtonNumber).html(renderReview).show();
						}
					}).fail(function(xhr, textStatus, errorThrown) {
						alert(jqXHR.responseJSON.error);
					});
				}
			});
		}
		
		function callBxSliderLibrary(){
			$('.bxslider').bxSlider();
		}
		
		//function for filling stars with value from array
		function fillStars(){
			for(var cnt=0; noOfStars = starsRatingArray[cnt]; cnt++){
				$('.rating_' + cnt).each(function(index){
					if(index === noOfStars)
					return false
					$(this).addClass('full');
				});
			}
		}
	});
});