$(document).ready(function () {
    function updateValues(value) {
        const goldRate = goldRates[currency];
        const diamondRate = diamondRates[currency];

        const goldWithBonus = calculate_bonus("gold", value);
        const diamondsWithBonus = calculate_bonus("diamond", value);

        $("#gold").text(goldWithBonus.toFixed(2));
        $("#diamond").text(diamondsWithBonus.toFixed(2));

        $("#get_value").text(currency + ' ' + value);

        if (value > 0) {
            $("#donate-main").show();
            $("#donate-info").hide();
        } else {
            $("#donate-main").hide();
            $("#donate-info").show();
        }

        let bonusPercent = bonus;
        let additionalBonus = 0;
        for (let key in bonus_additional) {
            if (value >= parseInt(key)) {
                additionalBonus = bonus_additional[key];
            }
        }
        bonusPercent += additionalBonus;

        if (bonus > 0) {
            $("#gold_normal_bonus").text((goldRate * value).toFixed(2));
            $("#diamond_normal_bonus").text((diamondRate * value).toFixed(2));
        } else {
            $("#gold_normal_bonus").empty();
            $("#diamond_normal_bonus").empty();
        }

        if (additionalBonus > 0) {
            $("#additional_bonus_message").html(`Você está recebendo um bônus de ${additionalBonus}% adicional sobre sua doação de ${value} ${currency}`);
            $("#gold_additional_bonus").text((goldRate * value * (1 + bonus / 100)).toFixed(2));
            $("#diamond_additional_bonus").text((diamondRate * value * (1 + bonus / 100)).toFixed(2));
        } else {
            $("#additional_bonus_message").empty();
            $("#gold_additional_bonus").empty();
            $("#diamond_additional_bonus").empty();
        }

        if (bonus > 0) {
            $("#bonus-message").html(`No total, você está recebendo ${bonusPercent}% a mais de recompensas.`);
        } else {
            $("#bonus-message").empty();
        }

        if (goldRate > 0) {
            $("#gold_container").show();
            if (bonus > 0 || additionalBonus > 0) {
                $("#gold_normal_bonus").show();
                $("#gold_additional_bonus").show();
            } else {
                $("#gold_normal_bonus").empty();
                $("#gold_additional_bonus").empty();
            }
        } else {
            $("#gold_container").hide();
        }

        if (diamondRate > 0) {
            $("#diamond_container").show();
            if (bonus > 0 || additionalBonus > 0) {
                $("#diamond_normal_bonus").show();
                $("#diamond_additional_bonus").show();
            } else {
                $("#diamond_normal_bonus").empty();
                $("#diamond_additional_bonus").empty();
            }
        } else {
            $("#diamond_container").hide();
        }
    }

    $("#set_value").maskMoney({
        allowNegative: false,
        thousands: ".",
        decimal: ",",
    });

    $("#set_value").on("keyup", function () {
        var value = parseFloat($(this).maskMoney("unmasked")[0]);
        if(value != 0 && value < 1) {
        $('#error').text('O valor mínimo é de 1 '+ currency);
        $('#donate-main').hide();
        } else {
        $("#value").val(value);
        $('#error').empty();
        updateValues(value);
        }
        $('#donate-info').show();
    });

    function calculate_bonus(type, amount) {
        let baseRate = type === "gold" ? goldRates[currency] : diamondRates[currency];
        let bonusPercent = bonus;
        let additionalBonus = 0;

        for (let key in bonus_additional) {
            if (amount >= parseInt(key)) {
                additionalBonus = bonus_additional[key];
            }
        }
        bonusPercent += additionalBonus;

        return baseRate * amount * (1 + bonusPercent / 100);
    }
});